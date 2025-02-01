import { useEffect } from 'react';
import { DotsThreeOutlineVertical, Funnel, Plus } from 'phosphor-react';
import {
  Badge,
  Button,
  Dropdown,
  DropdownAction,
  DropdownContent,
  DropdownItem,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'keep-react';

import { useProduct } from '../../hooks/useProduct';

const data = [
  {
    id: "b199f2db-0352-4dfe-9fc9-0229e31e7774",
    name: "Smartphone Pro X2",
    price: 999.99,
    category: "Smartphones", // Assuming you want to use this as the category
    rating: { rate: 4.5, count: 120 }, // Assuming a rating system where rate is the average score and count is the number of reviews
    stock: 45
  },
  {
    id: "b199f2db-0352-4dfe-9fc9-0229e31e7773",
    name: "Smartphone Pro X2",
    price: 999.99,
    category: "Smartphones", // Assuming you want to use this as the category
    rating: { rate: 4.5, count: 120 }, // Assuming a rating system where rate is the average score and count is the number of reviews
    stock: 45
  }
];

const ListProducts = ({callback}) => {
  const { fetchProductsForSeller, products } = useProduct();

  useEffect(() => {
    fetchProductsForSeller();
  }, [fetchProductsForSeller]);

  const handleDelete = (id) => {
    console.log('Delete product with ID:', id);
  };

  const handleEdit = (data) => {
    callback(data);
  };

  const handleAddProduct = () => {
    callback(null);
  };

  return (
    <Table className='bg-[#F0F3F9aa]'>
      <TableCaption className='bg-l-boxBg/60 rounded-t-lg'>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-heading-6 font-semibold text-metal-900 dark:text-white">Total Product</h2>
            <Badge className="border border-metal-900 text-metal-900 dark:bg-metal-800 dark:text-white">
              {products?.length || 0} Product
            </Badge>
          </div>
          <div className="flex items-center gap-5">
            <Button variant="outline" className="flex gap-1.5 !border-metal-900 !text-metal-900 dark:!border-white dark:!text-white" onClick={handleAddProduct}>
              <Plus className="size-4 fill-metal-900 dark:fill-white" />
              Add Product
            </Button>
            <Button variant="outline" className="flex gap-1.5 !border-metal-900 !text-metal-900 dark:!border-white dark:!text-white">
              <Funnel className="size-4 fill-metal-900 dark:fill-white" />
              Filter Product
            </Button>
          </div>
        </div>
      </TableCaption>
      <TableHeader className='!rounded-none !border-none'>
        <TableRow>
          <TableHead>
            <div className="w-[100px]">SKU</div>
          </TableHead>
          <TableHead>
            <div className="w-[160px]">Product Name</div>
          </TableHead>
          <TableHead>
            <div className="w-[65px]">Price</div>
          </TableHead>
          <TableHead>
            <div className="w-[100px]">Category</div>
          </TableHead>
          <TableHead>
            <div className="w-[60px]">Rating</div>
          </TableHead>
          <TableHead>
            <div className="w-[60px]">Stock</div>
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products && products?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</TableCell>
            <TableCell>{item?.category}</TableCell>
            <TableCell>{item?.rating?.rate} ({item?.rating?.count || 0} reviews)</TableCell>
            <TableCell>{item?.quantity}</TableCell>
            <TableCell>
              <Dropdown>
                <DropdownAction asChild>
                  <button>
                    <DotsThreeOutlineVertical className="size-4 fill-metal-900 dark:fill-white" />
                  </button>
                </DropdownAction>
                <DropdownContent align="end" className="w-[200px] border border-metal-100 p-3 dark:border-metal-800">
                  <DropdownItem onClick={() => handleEdit(item)}>Edit</DropdownItem>
                  <DropdownItem>Move</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListProducts;