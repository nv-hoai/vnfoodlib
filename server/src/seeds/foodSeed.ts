import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import csv from 'csv-parser';

// Load env variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to parse CSV file
function parseCSVFile(csvPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    let lineNumber = 0;
    
    fs.createReadStream(csvPath)
      .pipe(csv({ headers: ['name', 'intro', 'ingredients', 'cooking', 'tags', 'image'], mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        lineNumber++;
        try {
          // Clean up row keys (remove BOM if present)
          const cleanRow: any = {};
          for (const key in row) {
            const cleanKey = key.replace(/^\uFEFF/, '');
            cleanRow[cleanKey] = row[key];
          }

          // Parse tags JSON
          let tags = {};
          
          // Try to parse tags - check if column contains JSON
          if (cleanRow.tags && typeof cleanRow.tags === 'string' && cleanRow.tags.trim()) {
            try {
              tags = JSON.parse(cleanRow.tags);
            } catch (e) {
              console.log(`Warning: Could not parse tags on line ${lineNumber}: ${cleanRow.tags.substring(0, 50)}`);
              tags = {};
            }
          } else {
            tags = {};
          }

          // Only add if name exists and is not empty
          const name = cleanRow.name ? cleanRow.name.trim() : '';
          if (name) {
            results.push({
              name: name,
              intro: cleanRow.intro ? cleanRow.intro.trim() : '',
              ingredients: cleanRow.ingredients ? cleanRow.ingredients.trim() : '',
              cooking: cleanRow.cooking ? cleanRow.cooking.trim() : '',
              tags: tags,
              image: cleanRow.image ? cleanRow.image.trim() : ''
            });
            console.log(`Line ${lineNumber}: Parsed "${name}"`);
          }
        } catch (err) {
          console.error(`Error parsing row ${lineNumber}:`, err);
        }
      })
      .on('end', () => {
        console.log(`Total lines processed: ${lineNumber}, Valid foods: ${results.length}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

let foodsData: any[] = [];

// Connect to MongoDB and seed data
async function seedFoods() {
  try {
    // Load CSV data
    const csvPath = path.join(__dirname, '../../..', 'FoodData.csv');
    console.log(`Reading CSV from: ${csvPath}`);
    
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at ${csvPath}`);
      process.exit(1);
    }

    foodsData = await parseCSVFile(csvPath);
    console.log(`Loaded ${foodsData.length} foods from CSV`);

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vnfoodlibrary';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Import Food model
    const { default: Food } = await import('../features/foods/models/Food.js');

    await Food.deleteMany({});
    console.log('Cleared existing foods');

    // Insert foods
    const result = await Food.insertMany(foodsData);
    console.log(`Successfully seeded ${result.length} foods`);

    // Display inserted foods
    result.forEach((food) => {
      console.log(`  - ${food.name}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

// Run seed
seedFoods();
