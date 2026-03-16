"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editProduct, getCategories } from "@/components/lib/actions/admin-actions";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { Category, ProductWithCategory } from "@/types";

interface Props {
  product: ProductWithCategory;
}
export default function EditProductModal({ product }:  Props ) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const res = await getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await editProduct(product.id, formData);
      if (res.success) {
        toast.success("Product updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to edit product");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="gap-2 text-blue-600 hover:text-blue-700">
          <Pencil className="w-4 h-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" required defaultValue={product.categoryId} disabled={categories.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required defaultValue={product.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={Number(product.price)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Count</Label>
              <Input id="stock" name="stock" type="number" min="0" required defaultValue={product.stock} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (Comma separated URLs)</Label>
            <Textarea id="images" name="images" defaultValue={product.images?.join(", ")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes (Comma separated)</Label>
              <Input id="sizes" name="sizes" defaultValue={product.sizes?.join(", ")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colors">Colors (Comma separated)</Label>
              <Input id="colors" name="colors" defaultValue={product.colors?.join(", ")} />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
