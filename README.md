
# Mango VPN Connect

Welcome to Mango VPN Connect, a comprehensive, full-stack VPN application featuring a modern client dashboard, a powerful admin panel, and a secure backend infrastructure.

## ✨ Features

- **VPN Client Dashboard**: A responsive, user-friendly interface built with React and Tailwind CSS for connecting to global servers and monitoring real-time connection stats.
- **Admin Panel**: A complete administrative dashboard built with Next.js for managing users, servers, sessions, and viewing system logs.
- **Secure Backend**: A robust backend featuring:
  - JWT-based authentication with access and refresh tokens.
  - Role-Based Access Control (RBAC) protecting admin routes.
  - Password hashing with bcrypt.
  - RESTful APIs for all management tasks.
  - Rate limiting on sensitive endpoints.
- **UDP VPN Server (Simulation)**: A custom UDP-based server built with Node.js demonstrating core VPN concepts like client management, IP assignment, and encrypted data tunneling.
- **Comprehensive Test Suite**: Includes unit, integration, and API tests using Jest and Supertest to ensure reliability.
- **Deployment Ready**: Comes with configurations for Docker, Nginx, and PM2 for easy deployment.

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes, Mongoose
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Deployment**: Docker, Nginx, PM2

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- MongoDB (or Docker to run a container)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mango-vpn-suite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file and fill in your details.
    ```bash
    cp .env.example .env
    ```
    > **Note:** For local development, the default `MONGO_URI` in the `.env.example` file is configured for the Docker Compose setup. If you're running MongoDB locally, change it to `mongodb://localhost:27017/mangovpn`.

### Running the Application

- **Run the Next.js app (client and admin) in development mode:**
  ```bash
  npm run dev
  ```
  The client dashboard will be at [http://localhost:3000](http://localhost:3000).
  The admin panel will be available at [http://localhost:3000/admin](http://localhost:3000/admin).

- **Run the standalone UDP VPN server:**
  ```bash
  npm run vpn:start
  ```

## 🧪 Running Tests

To run the entire test suite, use:

```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To generate a coverage report:
```bash
npm run test:cov
```

## 📄 API Documentation

The API is documented using the OpenAPI 3.0 standard. You can find the specification in the `openapi.yaml` file. You can view the documentation interactively by pasting the contents of this file into an editor like [Swagger Editor](https://editor.swagger.io/).

## 🚢 Deployment

We provide configurations for two common deployment strategies: Docker and a traditional setup with PM2 and Nginx.

### Option 1: Docker (Recommended)

This is the easiest way to get the entire stack running in a containerized environment.

1.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the Next.js application image.
    - Start the Next.js app container.
    - Start the UDP VPN server within the same container.
    - Start a MongoDB container.
    - The application will be available at [http://localhost:3000](http://localhost:3000).

### Option 2: PM2 and Nginx

This method is suitable for deploying on a traditional virtual private server (VPS).

1.  **Build the application:**
    ```bash
    npm run build
    ```

2.  **Set up PM2:**
    - Install PM2 globally: `npm install pm2 -g`
    - Start the Next.js application and the VPN server using the provided ecosystem file:
    ```bash
    pm2 start ecosystem.config.js
    ```
    - You can monitor the processes with `pm2 list` or `pm2 monit`.

3.  **Configure Nginx:**
    - Use the provided `nginx.conf` as a template for your Nginx server block configuration (usually located in `/etc/nginx/sites-available/`).
    - This will set up Nginx as a reverse proxy, forwarding traffic from port 80 to your application running on port 3000.
    - Remember to enable the site and restart Nginx:
    ```bash
    sudo ln -s /etc/nginx/sites-available/mangovpn /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 📝 License

This project is licensed under the MIT License.