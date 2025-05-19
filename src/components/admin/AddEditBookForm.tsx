import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Book, BookFormData } from '@/types/book';

interface AddEditBookFormProps {
  book?: Book;
  onSubmit: (bookData: BookFormData) => Promise<void>;
}

const AddEditBookForm: React.FC<AddEditBookFormProps> = ({ book, onSubmit }) => {
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<BookFormData>({
    defaultValues: book ? {
      title: book.title,
      author: book.author,
      description: book.description,
      isbn: book.isbn,
      genre: book.genre,
      quantity: book.quantity,
      coverImage: book.coverImage
    } : {
      title: '',
      author: '',
      description: '',
      isbn: '',
      genre: '',
      quantity: 1,
      coverImage: ''
    }
  });

  const coverImage = watch('coverImage');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setValue('coverImage', imageUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('title', { required: 'Title is required' })} placeholder="Title" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      
      <div>
        <Input {...register('author', { required: 'Author is required' })} placeholder="Author" />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
      </div>

      <div>
        <Textarea {...register('description', { required: 'Description is required' })} placeholder="Description" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Input {...register('isbn', { required: 'ISBN is required' })} placeholder="ISBN" />
        {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn.message}</p>}
      </div>

      <div>
        <Input {...register('genre', { required: 'Genre is required' })} placeholder="Genre" />
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre.message}</p>}
      </div>

      <div>
        <Input 
          type="number" 
          {...register('quantity', { 
            required: 'Quantity is required',
            min: { value: 1, message: 'Quantity must be at least 1' }
          })} 
          placeholder="Quantity" 
        />
        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Cover Image</label>
        <div className="space-y-2">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="cursor-pointer" 
          />
          <p className="text-xs text-library-muted">Upload an image file from your computer</p>
        </div>
        
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-sm text-muted-foreground font-medium">OR</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <div className="space-y-2">
          <Input 
            {...register('coverImage', { required: 'Cover Image is required' })} 
            placeholder="Image URL" 
          />
          <p className="text-xs text-library-muted">Provide an image URL</p>
        </div>

        {coverImage && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img 
              src={coverImage} 
              alt="Cover preview" 
              className="max-w-[200px] h-auto rounded-md border border-library-border" 
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
      </Button>
    </form>
  );
};

export default AddEditBookForm;
