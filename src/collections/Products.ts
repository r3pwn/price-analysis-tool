import { CollectionConfig } from 'payload/types';
import { VENDORS } from '../constants';
import { Endpoint } from 'payload/config';

const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['productName', 'productSize', 'stores'],
    useAsTitle: 'productName',
  },
  access: {
    read: () => true
  },
  fields: [
    {
      name: 'productName',
      type: 'text',
    },
    {
      name: 'productSize',
      type: 'text'
    },
    {
      name: 'stores',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'select',
          required: true,
          options: VENDORS
        },
        {
          name: 'itemId',
          type: 'text',
          required: true
        },
        {
          name: 'price',
          type: 'number',
          admin: {
            step: 0.01
          }
        },
        {
          name: 'onSale',
          type: 'checkbox'
        },
        {
          name: 'originalPrice',
          type: 'number',
          admin: {
            step: 0.01,
            condition: (data, siblingData) => {
              return siblingData.onSale;
            }
          }
        }
      ]
    }
  ],
  endpoints: [
    // automatically create an API for each vendor
    ...(VENDORS.map((vendor) => ({
      path: `/${vendor.toLowerCase()}/:itemId`,
      method: "get",
      handler: async (req, res) => {
        const { itemId } = req.params;

        if (!itemId) {
          res.status(400).send({ error: "no product id provided" });
          return;
        }
        
        const products = await req.payload.find({
          collection: 'products',
          where: {
            and: [
              {
                'stores.name': {
                  equals: vendor
                }
              },
              {
                'stores.itemId': {
                  equals: itemId
                }
              }
            ]
          }
        });

        if (products.docs?.length) {
          res.status(200).send(products.docs[0]);
        } else {
          res.status(204).send({ error: "no product found" });
        }
      }
    })) as Omit<Endpoint, "root">[])
  ]
}

export default Product;