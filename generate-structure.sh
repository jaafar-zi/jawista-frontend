#!/bin/bash

# Core Module Structure
ng g m core
ng g s core/services/auth --skip-tests
ng g s core/services/api --skip-tests
ng g s core/services/logger --skip-tests
ng g guard core/guards/auth
ng g interceptor core/interceptors/http-error
ng g interceptor core/interceptors/auth-token

# Shared Module Structure
ng g m shared
ng g c shared/components/button --skip-tests
ng g c shared/components/input --skip-tests
ng g c shared/components/modal --skip-tests
ng g c shared/components/loader --skip-tests
ng g pipe shared/pipes/truncate
ng g directive shared/directives/highlight

# Layout Module Structure
ng g m layout
ng g c layout/header --skip-tests
ng g c layout/footer --skip-tests
ng g c layout/sidebar --skip-tests

echo "Enterprise structure created successfully!"