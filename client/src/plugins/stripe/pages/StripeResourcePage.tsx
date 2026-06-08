import { PluginResourcePage } from '@/plugins/_shared/PluginResourcePage';
import React from 'react';
import StripeController from '../controllers/stripeController';
import { StripeResourceItem } from '../models/stripeModel';
import { stripeResourceConfigs } from '../resources/stripeResources';

interface StripeResourcePageProps {
  resourceKey: keyof typeof stripeResourceConfigs;
}

export const StripeResourcePage: React.FC<StripeResourcePageProps> = ({ resourceKey }) => {
  return (
    <PluginResourcePage<StripeResourceItem>
      controller={StripeController}
      config={stripeResourceConfigs[resourceKey]}
    />
  );
};
