import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ResponseData } from "src/global/globalClass";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { Product } from 'src/models/product.model';
import { ProductDto } from "src/dto/product.dto";
import { AuthenticationGuard } from "src/authentication/authentication.guard";

@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductService){}

    @Get()
    @UseGuards(AuthenticationGuard)
    getListProduct(): ResponseData<Product[]>{
        try{
            return new ResponseData<Product[]>(this.productService.getListProduct(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        }catch(error){
            return new ResponseData<Product[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    createProduct(@Body(new ValidationPipe()) productDto: ProductDto): ResponseData<ProductDto>{
        try{
            return new ResponseData<Product>(this.productService.createProduct(productDto), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        }catch(error){
            return new ResponseData<Product>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Get('/:id')
    detailProduct(@Param('id') id: number): ResponseData<Product>{
        try{
            return new ResponseData<Product>(this.productService.detailProduct(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        }catch(error){
            return new ResponseData<Product>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put('/:id')
    updateProduct(@Body() productDto: ProductDto, @Param('id') id: number): ResponseData<Product>{
        try{
            return new ResponseData<Product>(this.productService.updateProduct(productDto, id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        }catch(error){
            return new ResponseData<Product>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
    
    @Delete('/:id')
    deleteProduct(@Param('id') id: number): ResponseData<boolean>{
        try{
            return new ResponseData<boolean>(this.productService.deleteProduct(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        }catch(error){
            return new ResponseData<boolean>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }
}