
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the BFHL API! Use the /bfhl POST endpoint.',
        status: 'Server is running'
    });
});


app.post('/bfhl', (req, res) => {
    let is_success = false;
    const user_id = "bhumi_ahlawat_04012005"; 
    const email = "bhumi225.be22@chitkara.edu.in"; 
    const roll_number = "2210990225"; 

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let concat_string = "";

    try {
        const { data } = req.body;

        // Checking if data is provided and is an array
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id,
                email,
                roll_number,
                message: "Invalid input: 'data' array is missing or malformed."
            });
        }

        // Temporary array to collect all individual alphabetical characters for concat_string
        const temp_alphabet_chars = [];

        data.forEach(item => {
            const itemStr = String(item);
            const isNumber = /^-?\d+$/.test(itemStr); 
            const isAlphabet = /^[a-zA-Z]+$/.test(itemStr);  

            if (isNumber) {
                // If it's a number, parse it and classify as even or odd
                const num = parseInt(itemStr, 10);
                if (num % 2 === 0) {
                    even_numbers.push(itemStr); 
                } else {
                    odd_numbers.push(itemStr); 
                }
                sum += num; // Add to sum
            } else if (isAlphabet) {
                alphabets.push(itemStr.toUpperCase()); // Converting to uppercase and add to alphabets array

                // Extract individual alphabetical characters for concat_string
                for (let i = 0; i < itemStr.length; i++) {
                    const char = itemStr[i];
                    if (/[a-zA-Z]/.test(char)) {
                        temp_alphabet_chars.push(char);
                    }
                }
            } else {
                // If it's neither a number nor an alphabet, it's a special character
                special_characters.push(itemStr);
            }
        });

        //'concat_string': reverse and alternating caps
        const reversed_alphabet_chars = temp_alphabet_chars.reverse();
        concat_string = reversed_alphabet_chars.map((char, index) => {
            return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
        }).join('');

      
        is_success = true;

        // Sending the final JSON response
        res.status(200).json({
            is_success,
            user_id,
            email,
            roll_number,
            odd_numbers,
            even_numbers,
            alphabets,
            special_characters,
            sum: String(sum),
            concat_string
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            user_id,
            email,
            roll_number,
            message: "An internal server error occurred.",
            error: error.message 
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}/bfhl (POST method)`);
});
