import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/utils/format';
import StripeController from '../controllers/stripeController';
import { StripeResourceItem } from '../models/stripeModel';

export const StripePaymentLinkCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<StripeResourceItem[]>([]);
  const [priceId, setPriceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [membershipTier, setMembershipTier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const result = await StripeController.list('prices');
      setPrices(result);
    };

    fetchPrices();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const result = await StripeController.createPaymentLink({
        priceId,
        quantity,
        membershipTier,
        skuName: selectedPrice?.metadata?.sku_name || '',
        skuId: selectedPrice?.metadata?.sku_id || '',
      });

      if (result.url) {
        window.open(result.url, '_blank');
      }

      navigate('/admin/plugins/stripe/payment-links');
    } catch (error) {
      console.error('Failed to create Stripe payment link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPrice = prices.find((price) => price.id === priceId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Stripe Link</h1>
        <p className="text-muted-foreground">
          Generate a hosted Stripe payment link for a membership price.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Link Details</CardTitle>
          <CardDescription>Select the membership price that customers will subscribe to.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Price</Label>
              <Select value={priceId} onValueChange={setPriceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select price" />
                </SelectTrigger>
                <SelectContent>
                  {prices.map((price) => (
                    <SelectItem key={price.id} value={price.id}>
                      {price.nickname || price.id} - {formatCurrency((Number(price.unit_amount) || 0) / 100, price.currency || 'usd')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="membershipTier">Membership Label</Label>
                <Input id="membershipTier" value={membershipTier} onChange={(event) => setMembershipTier(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <Button type="submit" disabled={isLoading || !priceId}>
                  {isLoading ? 'Saving...' : 'Create Link'}
                </Button>
              </div>
              <div className="flex justify-end">
                <Link to="/admin/plugins/stripe/payment-links">
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
