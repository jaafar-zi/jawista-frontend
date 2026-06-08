// src/app/api/services/product-controller.service.ts

/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createProduct } from '../fn/product-controller/create-product';
import { CreateProduct$Params } from '../fn/product-controller/create-product';
import { deleteProduct } from '../fn/product-controller/delete-product';
import { DeleteProduct$Params } from '../fn/product-controller/delete-product';
import { getAllProducts } from '../fn/product-controller/get-all-products';
import { GetAllProducts$Params } from '../fn/product-controller/get-all-products';
import { getProductById } from '../fn/product-controller/get-product-by-id';
import { GetProductById$Params } from '../fn/product-controller/get-product-by-id';
import { getProductBySku } from '../fn/product-controller/get-product-by-sku';
import { GetProductBySku$Params } from '../fn/product-controller/get-product-by-sku';
import { updateProduct } from '../fn/product-controller/update-product';
import { UpdateProduct$Params } from '../fn/product-controller/update-product';
import { toggleActive } from '../fn/product-controller/toggle-active';
import { ToggleActive$Params } from '../fn/product-controller/toggle-active';

import { ProductDto } from '../models/product-dto';

@Injectable({ providedIn: 'root' })
export class ProductControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── GET ALL PRODUCTS ─────────────────────────────────────────

  getAllProducts$Response(
    params?: GetAllProducts$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<ProductDto>>> {
    return getAllProducts(this.http, this.rootUrl, params, context);
  }

  getAllProducts(
    params?: GetAllProducts$Params,
    context?: HttpContext
  ): Observable<Array<ProductDto>> {
    return this.getAllProducts$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ProductDto>>): Array<ProductDto> => r.body)
    );
  }

  // ─── GET PRODUCT BY ID ────────────────────────────────────────

  getProductById$Response(
    params: GetProductById$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ProductDto>> {
    return getProductById(this.http, this.rootUrl, params, context);
  }

  getProductById(
    params: GetProductById$Params,
    context?: HttpContext
  ): Observable<ProductDto> {
    return this.getProductById$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProductDto>): ProductDto => r.body)
    );
  }

  // ─── GET PRODUCT BY SKU ───────────────────────────────────────

  getProductBySku$Response(
    params: GetProductBySku$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ProductDto>> {
    return getProductBySku(this.http, this.rootUrl, params, context);
  }

  getProductBySku(
    params: GetProductBySku$Params,
    context?: HttpContext
  ): Observable<ProductDto> {
    return this.getProductBySku$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProductDto>): ProductDto => r.body)
    );
  }

  // ─── CREATE PRODUCT ───────────────────────────────────────────

  createProduct$Response(
    params: CreateProduct$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ProductDto>> {
    return createProduct(this.http, this.rootUrl, params, context);
  }

  createProduct(
    params: CreateProduct$Params,
    context?: HttpContext
  ): Observable<ProductDto> {
    return this.createProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProductDto>): ProductDto => r.body)
    );
  }

  // ─── UPDATE PRODUCT ───────────────────────────────────────────

  updateProduct$Response(
    params: UpdateProduct$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ProductDto>> {
    return updateProduct(this.http, this.rootUrl, params, context);
  }

  updateProduct(
    params: UpdateProduct$Params,
    context?: HttpContext
  ): Observable<ProductDto> {
    return this.updateProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProductDto>): ProductDto => r.body)
    );
  }

  // ─── DELETE PRODUCT ───────────────────────────────────────────

  deleteProduct$Response(
    params: DeleteProduct$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return deleteProduct(this.http, this.rootUrl, params, context);
  }

  deleteProduct(
    params: DeleteProduct$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.deleteProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  // ─── TOGGLE ACTIVE ────────────────────────────────────────────

  toggleActive$Response(
    params: ToggleActive$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ProductDto>> {
    return toggleActive(this.http, this.rootUrl, params, context);
  }

  toggleActive(
    params: ToggleActive$Params,
    context?: HttpContext
  ): Observable<ProductDto> {
    return this.toggleActive$Response(params, context).pipe(
      map((r: StrictHttpResponse<ProductDto>): ProductDto => r.body)
    );
  }
}