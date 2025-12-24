'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// 👇 1. Add 'onDelete' to the props interface
interface DeleteButtonProps {
  id: string;
  onDelete?: () => void; 
}

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 👇 2. If parent passed a callback, run it! (Instant UI removal)
        if (onDelete) {
          onDelete();
        } else {
          router.refresh(); 
        }
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <button 
        className="noselect" 
        onClick={handleDelete} 
        disabled={loading}
        type="button"
      >
        <span className="text">Delete</span>
        <span className="icon">
          {loading ? (
            <Loader2 className="animate-spin" size={15} color="#eee" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          )}
        </span>
      </button>
    </StyledWrapper>
  );
}

// 👇 Your Exact Styles (Unchanged)
const StyledWrapper = styled.div`
  button {
    width: 90px;
    height: 34px; /* Slightly adjusted height to fit table better */
    cursor: pointer;
    display: flex;
    align-items: center;
    background: #e62222;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    position: relative;
    overflow: hidden;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: #ff3636;
  }

  button, button span {
    transition: 200ms;
  }

  button .text {
    transform: translateX(25px);
    color: white;
    font-weight: bold;
    font-size: 12px; /* Adjusted for table */
  }

  button .icon {
    position: absolute;
    border-left: 1px solid #c41b1b;
    transform: translateX(110px);
    height: 100%;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button svg {
    width: 12px;
    fill: #eee;
  }

  button:not(:disabled):hover {
    background: #ff3636;
  }

  button:not(:disabled):hover .text {
    color: transparent;
  }

  button:not(:disabled):hover .icon {
    width: 90px;
    border-left: none;
    transform: translateX(0);
  }

  button:focus {
    outline: none;
  }

  button:active .icon svg {
    transform: scale(0.8);
  }
`;