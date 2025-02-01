import { useState } from "react";
import AddProductForm from "../components/manage-products/AddProductForm";
import ListProducts from "../components/manage-products/ListProducts";
import { Grid, Paper } from "@mui/material";
import { Tabs, TabsList, TabsItem, TabsContent } from "keep-react";
import { User, Gear, Buildings, ShieldWarning } from "phosphor-react";

const ManageProducts = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [editData, setEditData] = useState([]);

  const handleProductEditData = (data) => {
    setEditData(data);
    setActiveTab("tab2");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      <Grid container spacing={4} className="p-4 py-2">
      <Grid item xs={12} md={12}>
        <div className="flex flex-col px-4">
          <div className="text-2xl font-bold text-center">
            Manage Products
          </div>
          <div className="">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="items-start justify-start gap-2 flex">
                <TabsItem value="tab1" className="bg-l-boxBg dark:text-d-ctaText dark:bg-d-background">Product List</TabsItem>
                <TabsItem value="tab2" className="bg-l-boxBg dark:text-d-ctaText dark:bg-d-background">Add New Product</TabsItem>
                <TabsItem value="tab3" className="bg-l-boxBg dark:text-d-ctaText dark:bg-d-background">Filter Products</TabsItem>
              </TabsList>
              <TabsContent value="tab1">
                <ListProducts callback={(data) => handleProductEditData(data)} />
              </TabsContent>
              <TabsContent value="tab2">
                <AddProductForm data={editData} />
              </TabsContent>
              <TabsContent value="tab3">Content for Tab 3</TabsContent>
            </Tabs>
          </div>
        </div>
      </Grid>
      </Grid>
    </div>
  );
};

export default ManageProducts;