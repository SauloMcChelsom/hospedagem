FROM node:16.15.1

RUN apt-get -y update

RUN apt-get install -y git

WORKDIR /home

COPY . .

RUN npm i

CMD [ "sh", "-c", "npm run start:dev"]