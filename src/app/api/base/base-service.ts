// src/app/api/base-service.ts

/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';

@Injectable({ providedIn: 'root' })
export class BaseService {

  constructor(
    protected config: ApiConfiguration,
    protected http: HttpClient
  ) {}

  get rootUrl(): string {
    return this.config.rootUrl || '';
  }
}