import { CollectionConfig } from 'payload/types';
import { PRODUCT_ID_TYPES, VENDORS } from '../constants';

const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['productName', 'prices', 'updatedAt'],
    useAsTitle: 'productName',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
    },
    {
      name: 'productIds',
      type: 'array',
      fields: [
        {
          name: 'idType',
          type: 'select',
          required: true,
          options: PRODUCT_ID_TYPES
        },
        {
          name: 'idValue',
          type: 'text',
          required: true
        }
      ]
    },
    {
      name: 'prices',
      type: 'array',
      fields: [
        {
          name: 'vendor',
          type: 'select',
          required: true,
          options: VENDORS
        },
        {
          name: 'price',
          type: 'number',
          admin: {
            step: 0.01
          }
        }
      ]
    }
  ]
}

export default Product;