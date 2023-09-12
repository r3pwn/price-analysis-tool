import { CollectionConfig } from 'payload/types';
import { PRODUCT_ID_TYPES, VENDORS } from '../constants';
import { Endpoint } from 'payload/config';

const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    defaultColumns: ['productName', 'productSize', 'prices'],
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
    // automatically create an API for each ID type
    ...(PRODUCT_ID_TYPES.map((idType) => ({
      path: `/by${idType.toLowerCase()}/:itemId`,
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
                'productIds.idType': {
                  equals: idType
                }
              },
              {
                'productIds.idValue': {
                  equals: itemId
                }
              }
            ]
          }
        });

        if (products.docs?.length) {
          res.status(200).send(products.docs);
        } else {
          res.status(204).send({ error: "no product found" });
        }
      }
    })) as Omit<Endpoint, "root">[])
  ]
}

export default Product;