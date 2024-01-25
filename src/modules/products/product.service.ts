import { Injectable } from '@nestjs/common';
import { ProductDto } from 'src/dto/product.dto';
import { Product } from 'src/models/product.model';

@Injectable()
export class ProductService{

    private products: Product[] = [
        {id: 1, categoryId: 1, productName: 'Product 1', price: 10000},
        {id: 2, categoryId: 2, productName: 'Product 2', price: 20000},
        {id: 3, categoryId: 2, productName: 'Product 3', price: 30000},
        {id: 4, categoryId: 3, productName: 'Product 4', price: 40000},
        {id: 5, categoryId: 3, productName: 'Product 5', price: 50000},
    ]

    getListProduct(): Product[]{
        return this.products;
    }

    createProduct(productDto: ProductDto): Product{
        const product: Product = {
            id: Math.random(),
            ...productDto
        };
        this.products.push(product);
        return product
    }

    detailProduct(id: number): Product{
        return this.products.find(item => item.id === Number(id));
    }

    updateProduct(): string{
        return 'UPDATE PRODUCT'
    }

    deleteProduct(): string{
        return 'DELETE PRODUCT'
    }
}