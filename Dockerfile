# FROM node:16-alpine

# WORKDIR /src
# COPY . .

# # Install dependancies
# RUN npm install -g ts-node
# RUN npm install -g typescript
# RUN npm install

# # Build typescript project
# # RUN npm run build

# # Expose server ports
# # EXPOSE 3000

# # Specify default CMD
# CMD ["npm", "run", "dev"]
 
FROM public.ecr.aws/lambda/nodejs:16 as builder
WORKDIR /src
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
    

FROM public.ecr.aws/lambda/nodejs:16
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder ./dist/* ./
CMD ["index.handler"]