# Kubernetes Express + MongoDB Project

## Overview
This is my **first hands-on project** deploying a simple **Express.js web application** with a **MongoDB database** on **Kubernetes (Minikube)**.  
The web app includes a **login and signup system**, storing user credentials securely in MongoDB.

---

## Features / Endpoints

- **Signup**
  - `GET /signup` → returns signup form
  - `POST /signup` → creates a new user with hashed password

- **Login**
  - `GET /login` → returns login form
  - `POST /login` → verifies credentials

- **Database**
  - Stores user data securely in MongoDB (`testdb` database)

---

## What I Did Today

1. **MongoDB Deployment and Service**
   - Created `mongo-deployment` pod running MongoDB 5.0
   - Exposed MongoDB with a **ClusterIP service** (`mongo-service`)
   - Configured environment variables for username/password using Kubernetes Secrets

2. **Express Web App Deployment and Service**
   - Created `webapp-deployment` pod running the Express app
   - Exposed the web app with a **NodePort service** (`webapp-service`) on port `30100`
   - Implemented login/signup endpoints

3. **Verified Deployments**
   - Both MongoDB and Express pods are **Running**
   - Checked services using `kubectl get all`

4. **Accessing the Applications**
   - Web app URL: `http://<minikube-ip>:30100`
   - MongoDB access via port-forward:
     ```bash
     kubectl port-forward svc/mongo-service 27017:27017
     ```

5. **Database Testing**
   - Connected to MongoDB and verified collections and data
   - Mongo shell commands:
     ```bash
     show dbs
     use <db>
     show collections
     db.<collection>.find().pretty()
     ```

---

## Commands Used

```bash
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/webapp.yaml
kubectl get all
kubectl logs -f pod/<pod-name>
kubectl port-forward svc/mongo-service 27017:27017
minikube ip
