import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

// GET: Fetch Single Product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type changed to Promise
) {
  try {
    const { id } = await params; // 👈 AWAIT THE PARAMS HERE
    await connectToDatabase();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

// PUT: Update Product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type changed to Promise
) {
  try {
    const { id } = await params; // 👈 AWAIT THE PARAMS HERE
    const body = await request.json();
    await connectToDatabase();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

// DELETE: Delete Product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Type changed to Promise
) {
  try {
    const { id } = await params; // 👈 AWAIT THE PARAMS HERE
    await connectToDatabase();
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}