# creates namespace if not exists
# and copy secrets dockerhub secrets there
ns:
	kubectl apply -f ns.yaml
	kubectl patch serviceaccount default -p '{"automountServiceAccountToken":false}' -n k6-test-api-standalone

lint:
	kustomize build . | kube-linter lint --config ./../../.kube-linter.yaml -

plan:
	kustomize build . | kubectl diff -f -

apply:
	kustomize build . | kubectl apply -f -

delete:
	kustomize build . | kubectl delete -f -

# migrate_up:
# 	kustomize build ./jobs/migrate-up | kubectl apply -f -

# migrate_down:
# 	kustomize build ./jobs/migrate-down | kubectl apply -f -

port-forward:
	kubectl port-forward service/k6-test-api 8080:80

# smoke_test:
# 	k6 cloud \
# 	-e BASE_URL="https://pizza-main.staging.k6.io/standalone/restaurant/stable" \
# 	-e K6_PROJECT_ID=3533728 \
# 	-e K6_TEST_NAME=restaurantStableStandaloneSmokeTest \
# 	-e PROMETHEUS_URL="https://prometheus-demosites.staging.k6.io/api/v1/query" \
# 	-e K8S_NAMESPACE=k6-test-api-standalone \
# 	-e K8S_COMPONENT=restaurant \
# 	--stage=1m:10 \
# 	../../../../k6/script.js


# load_test:
# 	k6 cloud \
# 	-e BASE_URL="https://pizza-main.staging.k6.io/standalone/restaurant/stable" \
# 	-e K6_PROJECT_ID=3533728 \
# 	-e K6_TEST_NAME=restaurantStableStandaloneLoadTest \
# 	-e PROMETHEUS_URL="https://prometheus-demosites.staging.k6.io/api/v1/query" \
# 	-e K8S_NAMESPACE=k6-test-api-standalone \
# 	-e K8S_COMPONENT=restaurant \
# 	--stage=10m:500 \
# 	../../../../k6/script.js


help:
	@echo ""
	@echo "Quickpizza restaurant feat-authors environment in the local cluster"
	@echo " ns          	Setup a namespace (once only)"
	@echo " plan          	Show diffs between deployed api objects and manifests"
	@echo " apply          	Apply manifests"
	@echo " delete   		Delete objects (specified in manifests only)"
	@echo " smoke_test   	Run cloud smoke test"
	@echo " load_test   	Run cloud load test"

.PHONY: ns plan apply delete smoke_test load_test help
