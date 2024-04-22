FROM node:20-bookworm

RUN mkdir /app
WORKDIR /app

RUN apt-get update && apt-get install -y \
  build-essential \
  zlib1g-dev \
  libncurses5-dev \
  libgdbm-dev \
  libnss3-dev \
  libssl-dev \
  libreadline-dev \
  libffi-dev \
  libsqlite3-dev \
  wget \
  libbz2-dev \
  python3 \
  python3-pip \
  python3-venv

RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

RUN pip install --upgrade pip
RUN pip install uvicorn fastapi

COPY ./app/package*.json ./
RUN npm install 
RUN npm install three
RUN npm install @react-three/fiber

COPY ./app ./

ENV PATH /app/node_modules/.bin:$PATH

CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port 8000 --reload & npm start"]
