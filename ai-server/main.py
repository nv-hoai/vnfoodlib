from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as rt
from PIL import Image
import io
import json
import numpy as np
import os
from scipy.special import softmax

# Initialize FastAPI app
app = FastAPI(
    title="VN Food Classifier API",
    description="Image classification API for Vietnamese food detection",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory where the script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.onnx")
LABELS_PATH = os.path.join(BASE_DIR, "model", "labels.json")
LABELS_VN_PATH = os.path.join(BASE_DIR, "model", "labels_vn.json")

# Load model
try:
    sess = rt.InferenceSession(
        MODEL_PATH,
        providers=['CPUExecutionProvider']
    )
    print(f"✅ Model loaded from: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    sess = None

# Load labels (slug format for database)
try:
    with open(LABELS_PATH, 'r', encoding='utf-8') as f:
        labels_dict = json.load(f)
    # Convert keys to int for easier indexing
    labels = {int(k): v for k, v in labels_dict.items()}
    print(f"✅ Labels loaded: {len(labels)} classes")
except Exception as e:
    print(f"❌ Failed to load labels: {e}")
    labels = {}

# Load Vietnamese labels (display format with accents)
try:
    with open(LABELS_VN_PATH, 'r', encoding='utf-8') as f:
        labels_vn_dict = json.load(f)
    # Convert keys to int for easier indexing
    labels_vn = {int(k): v for k, v in labels_vn_dict.items()}
    print(f"✅ Vietnamese labels loaded: {len(labels_vn)} classes")
except Exception as e:
    print(f"❌ Failed to load Vietnamese labels: {e}")
    labels_vn = {}

# ImageNet normalization parameters
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
INPUT_SIZE = 224


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for ResNet50 model
    - Resize to 224x224
    - Convert to RGB
    - Normalize with ImageNet stats
    - Convert to (1, 3, 224, 224) format
    """
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to 224x224
    image = image.resize((INPUT_SIZE, INPUT_SIZE), Image.Resampling.LANCZOS)
    
    # Convert to numpy array and normalize to [0, 1]
    image_array = np.array(image, dtype=np.float32) / 255.0
    
    # Normalize with ImageNet statistics
    image_array = (image_array - MEAN) / STD
    
    # Transpose to (3, 224, 224)
    image_array = np.transpose(image_array, (2, 0, 1))
    
    # Add batch dimension: (1, 3, 224, 224)
    image_array = np.expand_dims(image_array, 0)
    
    return image_array


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "VN Food Classifier API is running",
        "model_loaded": sess is not None,
        "total_classes": len(labels)
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    if sess is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {"status": "healthy"}


@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    """
    Classify an image of Vietnamese food
    
    Returns:
    - class_id: ID of the predicted class
    - class_name: Name of the predicted food (Vietnamese)
    - confidence: Confidence score (0-1)
    - top_5: Top 5 predictions with scores
    """
    
    if sess is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Preprocess
        image_array = preprocess_image(image)
        
        # Get input/output names
        input_name = sess.get_inputs()[0].name
        output_name = sess.get_outputs()[0].name
        
        # Run inference
        result = sess.run([output_name], {input_name: image_array})
        
        # Get logits (result[0] shape: (1, num_classes))
        logits = result[0][0]
        
        # Apply softmax to convert logits to probabilities
        predictions = softmax(logits)
        
        # Get top 5 predictions
        top_5_indices = np.argsort(predictions)[-5:][::-1]
        top_5_predictions = [
            {
                "rank": idx + 1,
                "class_id": int(top_idx),
                "class_slug": labels.get(int(top_idx), "Unknown"),
                "class_name": labels_vn.get(int(top_idx), "Unknown"),
                "confidence": float(predictions[int(top_idx)]),
                "score": float(predictions[int(top_idx)])
            }
            for idx, top_idx in enumerate(top_5_indices)
        ]
        
        # Get top 1 prediction
        top_pred_idx = int(np.argmax(predictions))
        top_confidence = float(np.max(predictions))
        
        return {
            "success": True,
            "prediction": {
                "class_id": top_pred_idx,
                "class_slug": labels.get(top_pred_idx, "Unknown"),
                "class_name": labels_vn.get(top_pred_idx, "Unknown"),
                "confidence": top_confidence,
                "score": top_confidence
            },
            "top_5": top_5_predictions,
            "filename": file.filename
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing image: {str(e)}"
        )


@app.post("/batch-classify")
async def batch_classify(files: list[UploadFile] = File(...)):
    """
    Classify multiple images at once
    """
    
    if sess is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    results = []
    
    for file in files:
        try:
            # Read image file
            image_data = await file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # Preprocess
            image_array = preprocess_image(image)
            
            # Get input/output names
            input_name = sess.get_inputs()[0].name
            output_name = sess.get_outputs()[0].name
            
            # Run inference
            result = sess.run([output_name], {input_name: image_array})
            logits = result[0][0]
            
            # Apply softmax to convert logits to probabilities
            predictions = softmax(logits)
            
            # Get top prediction
            top_pred_idx = int(np.argmax(predictions))
            top_confidence = float(np.max(predictions))
            
            results.append({
                "filename": file.filename,
                "success": True,
                "prediction": {
                    "class_id": top_pred_idx,
                    "class_slug": labels.get(top_pred_idx, "Unknown"),
                    "class_name": labels_vn.get(top_pred_idx, "Unknown"),
                    "confidence": top_confidence
                }
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total": len(files),
        "successful": sum(1 for r in results if r["success"]),
        "results": results
    }


@app.get("/labels")
async def get_labels():
    """Get all available labels (slug format for database)"""
    return {
        "total_classes": len(labels),
        "labels": labels
    }


@app.get("/labels-vn")
async def get_labels_vn():
    """Get all available Vietnamese labels (with accents for display)"""
    return {
        "total_classes": len(labels_vn),
        "labels": labels_vn
    }


@app.get("/labels-all")
async def get_all_labels():
    """Get all available labels in both formats (slug and Vietnamese)"""
    # Merge slug and Vietnamese labels
    combined = {}
    for key in labels.keys():
        combined[key] = {
            "slug": labels.get(key, "Unknown"),
            "name_vn": labels_vn.get(key, "Unknown")
        }
    
    return {
        "total_classes": len(combined),
        "labels": combined
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5001,
        reload=False
    )
