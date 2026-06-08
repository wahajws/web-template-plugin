import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StripeController from '../controllers/stripeController';
import { StripeResourceItem } from '../models/stripeModel';

export const StripeMembershipCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<StripeResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useExistingProduct, setUseExistingProduct] = useState(false);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [nickname, setNickname] = useState('');
  const [skuName, setSkuName] = useState('');
  const [skuId, setSkuId] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('usd');
  const [interval, setInterval] = useState('month');

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await StripeController.list('products');
      setProducts(result);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      let selectedProductId = productId;

      if (!useExistingProduct) {
        const product = await StripeController.createProduct({
          name: productName,
          description,
          membershipTier: nickname || productName,
          skuName,
          skuId,
        });
        selectedProductId = product.id;
      }

      await StripeController.createPrice({
        productId: selectedProductId,
        nickname,
        amount,
        currency,
        interval,
        membershipTier: nickname,
        skuName,
        skuId,
      });

      navigate('/admin/plugins/stripe/memberships');
    } catch (error) {
      console.error('Failed to create Stripe membership:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Membership Tier</h1>
        <p className="text-muted-foreground">
          Create a Stripe product and recurring price for a membership tier.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Membership Details</CardTitle>
          <CardDescription>Stripe stores the tier as a product and price.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Product Source</Label>
              <Select value={useExistingProduct ? 'existing' : 'new'} onValueChange={(value) => setUseExistingProduct(value === 'existing')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create new product</SelectItem>
                  <SelectItem value="existing">Use existing product</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {useExistingProduct ? (
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name || product.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" value={productName} onChange={(event) => setProductName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">Tier Name</Label>
                <Input id="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skuName">SKU Name</Label>
                <Input id="skuName" value={skuName} onChange={(event) => setSkuName(event.target.value)} placeholder="Enter SKU name" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skuId">SKU ID</Label>
                <Input id="skuId" value={skuId} onChange={(event) => setSkuId(event.target.value)} placeholder="Enter SKU ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(Number(event.target.value))} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value={currency} onChange={(event) => setCurrency(event.target.value.toLowerCase())} required />
              </div>
              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="one_time">One Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Create Membership'}
                </Button>
              </div>
              <div className="flex justify-end">
                <Link to="/admin/plugins/stripe/memberships">
                  <Button type="button" variant="secondary">Cancel</Button>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
