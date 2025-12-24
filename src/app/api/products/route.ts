import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db'; // 👈 Make sure this path is correct!
import Product from '@/models/Product';   // 👈 Make sure this path is correct!

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

// 👇 UPDATED POST FUNCTION WITH DEBUGGING
export async function POST(request: Request) {
  try {
    console.log("1. API received POST request"); // Debug Log

    const body = await request.json();
    console.log("2. Data received:", body); // Debug Log

    console.log("3. Connecting to MongoDB...");
    await connectToDatabase();
    console.log("4. Connected to MongoDB");

    console.log("5. Attempting to create Product...");
    const newProduct = await Product.create(body);
    console.log("6. Product Created!", newProduct);

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    // 👇 THIS IS THE IMPORTANT PART
    console.error("❌ CRITICAL API ERROR:", error); // Prints full error to terminal
    
    return NextResponse.json(
      { 
        message: 'Failed to create product', 
        error: error.message,
        details: error.toString() 
      },
      { status: 500 }
    );
  }
}