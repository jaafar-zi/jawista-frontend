// src/app/api/services/address-controller.service.ts

/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base/base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createAddress } from '../fn/address-controller/create-address';
import { CreateAddress$Params } from '../fn/address-controller/create-address';
import { getAddress } from '../fn/address-controller/get-address';
import { GetAddress$Params } from '../fn/address-controller/get-address';
import { updateAddress } from '../fn/address-controller/update-address';
import { UpdateAddress$Params } from '../fn/address-controller/update-address';
import { deleteAddress } from '../fn/address-controller/delete-address';
import { DeleteAddress$Params } from '../fn/address-controller/delete-address';
import { getCustomerAddresses } from '../fn/address-controller/get-customer-addresses';
import { GetCustomerAddresses$Params } from '../fn/address-controller/get-customer-addresses';
import { getCustomerAddressesByType } from '../fn/address-controller/get-customer-addresses-by-type';
import { GetCustomerAddressesByType$Params } from '../fn/address-controller/get-customer-addresses-by-type';
import { getDefaultAddress } from '../fn/address-controller/get-default-address';
import { GetDefaultAddress$Params } from '../fn/address-controller/get-default-address';
import { setDefaultAddress } from '../fn/address-controller/set-default-address';
import { SetDefaultAddress$Params } from '../fn/address-controller/set-default-address';

import { AddressDto } from '../models/address-dto';

@Injectable({ providedIn: 'root' })
export class AddressControllerService extends BaseService {

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  // ─── GET ADDRESS ───────────────────────────────────────────
  getAddress$Response(
    params: GetAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AddressDto>> {
    return getAddress(this.http, this.rootUrl, params, context);
  }

  getAddress(
    params: GetAddress$Params,
    context?: HttpContext
  ): Observable<AddressDto> {
    return this.getAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<AddressDto>): AddressDto => r.body)
    );
  }

  // ─── GET CUSTOMER ADDRESSES ────────────────────────────────
  getCustomerAddresses$Response(
    params: GetCustomerAddresses$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<AddressDto>>> {
    return getCustomerAddresses(this.http, this.rootUrl, params, context);
  }

  getCustomerAddresses(
    params: GetCustomerAddresses$Params,
    context?: HttpContext
  ): Observable<Array<AddressDto>> {
    return this.getCustomerAddresses$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AddressDto>>): Array<AddressDto> => r.body)
    );
  }

  // ─── GET CUSTOMER ADDRESSES BY TYPE ────────────────────────
  getCustomerAddressesByType$Response(
    params: GetCustomerAddressesByType$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<AddressDto>>> {
    return getCustomerAddressesByType(this.http, this.rootUrl, params, context);
  }

  getCustomerAddressesByType(
    params: GetCustomerAddressesByType$Params,
    context?: HttpContext
  ): Observable<Array<AddressDto>> {
    return this.getCustomerAddressesByType$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AddressDto>>): Array<AddressDto> => r.body)
    );
  }

  // ─── GET DEFAULT ADDRESS ──────────────────────────────────
  getDefaultAddress$Response(
    params: GetDefaultAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AddressDto>> {
    return getDefaultAddress(this.http, this.rootUrl, params, context);
  }

  getDefaultAddress(
    params: GetDefaultAddress$Params,
    context?: HttpContext
  ): Observable<AddressDto> {
    return this.getDefaultAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<AddressDto>): AddressDto => r.body)
    );
  }

  // ─── CREATE ADDRESS ───────────────────────────────────────
  createAddress$Response(
    params: CreateAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AddressDto>> {
    return createAddress(this.http, this.rootUrl, params, context);
  }

  createAddress(
    params: CreateAddress$Params,
    context?: HttpContext
  ): Observable<AddressDto> {
    return this.createAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<AddressDto>): AddressDto => r.body)
    );
  }

  // ─── UPDATE ADDRESS ───────────────────────────────────────
  updateAddress$Response(
    params: UpdateAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AddressDto>> {
    return updateAddress(this.http, this.rootUrl, params, context);
  }

  updateAddress(
    params: UpdateAddress$Params,
    context?: HttpContext
  ): Observable<AddressDto> {
    return this.updateAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<AddressDto>): AddressDto => r.body)
    );
  }

  // ─── DELETE ADDRESS ───────────────────────────────────────
  deleteAddress$Response(
    params: DeleteAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return deleteAddress(this.http, this.rootUrl, params, context);
  }

  deleteAddress(
    params: DeleteAddress$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.deleteAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  // ─── SET DEFAULT ADDRESS ──────────────────────────────────
  setDefaultAddress$Response(
    params: SetDefaultAddress$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<AddressDto>> {
    return setDefaultAddress(this.http, this.rootUrl, params, context);
  }

  setDefaultAddress(
    params: SetDefaultAddress$Params,
    context?: HttpContext
  ): Observable<AddressDto> {
    return this.setDefaultAddress$Response(params, context).pipe(
      map((r: StrictHttpResponse<AddressDto>): AddressDto => r.body)
    );
  }
}