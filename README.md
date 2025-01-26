# Dizzy Designs

Dizzy Designs is an online clothing retail website allowing customers to browse through different clothing options seamlessly, add items to their cart, order items, and leave reviews. Our website will be accessible by the two groups mentioned below.

Non-registered users will be able to access all of the basic features of the website such as viewing clothes, adding items to cart, and placing an order. They will also be able to use text-based searches to locate items more efficiently. In order to save things in their cart for later, leave reviews, or see previous purchases, they will have to create an account and become a registered user. There will also be specific incentives such as discounts which are accessible to those who register and make an account for Dizzy Designs.

Registered users can save their credit card information, home address, access discounts, and will be able to view their previous purchases. Registered users will also have the ability to place product reviews on product pages and these reviews will be saved in the database to be viewed by all who visit the product site. Moreover, registered users will be able to have their shopping cart data saved from previous sessions if website cache is cleared.


![Home Image](./assets/DizzyDesignHome.png) 

![Search Image](./assets/DizzyDesignSearch.png)



## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/jferrellRU/G6
    ```
2. Navigate to the project directory:
    ```sh
    cd G6
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
5. Add your .env

    ```
    MONGODB_URI = "mongodb+srv://USER_NAME:PASSWORD@CLUSTER_NAME.CLUSTER_NUMBER.mongodb.net/DB_NAME?retryWrites=true&w=majority&appName=CLUSTER_NAME"
    ENVIRONMENT=sandbox
    CLIENT_ID <Get this from a paypal buisness account>
    CLIENT_SECRET <Get this from a paypal buisness account>
    RESEND_API_KEY <Get this from resend.com>
    JWT_SECRET=secret
    EMAIL
    ```

4. Build the app:
    ```sh
    npm run build
    ```


## Usage

To start the application, run:
```sh
node app.js
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. 
