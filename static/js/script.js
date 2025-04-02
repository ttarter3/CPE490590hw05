// static/js/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const predictionForm    = document.getElementById('prediction-form');
    const image_upload = document.getElementById('image_upload');
    const predictionResultDiv = document.getElementById('prediction-result');
    const exampleButtons = document.querySelectorAll('.use-example-btn');

    // Initialize Chart.js
    const ctx = document.getElementById('probability-chart').getContext('2d');
    let probabilityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            datasets: [{
                label: 'Probability',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(255, 154, 162, 0.7)',
                    'rgba(181, 234, 215, 0.7)',
                    'rgba(199, 206, 234, 0.7)',
                    'rgba(255, 154, 162, 0.7)',
                    'rgba(181, 234, 215, 0.7)',
                    'rgba(199, 206, 234, 0.7)',
                    'rgba(255, 154, 162, 0.7)',
                    'rgba(181, 234, 215, 0.7)',
                    'rgba(199, 206, 234, 0.7)',
                    'rgba(255, 154, 162, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 154, 162)',
                    'rgb(181, 234, 215)',
                    'rgb(199, 206, 234)',
                    'rgb(255, 154, 162)',
                    'rgb(181, 234, 215)',
                    'rgb(199, 206, 234)',
                    'rgb(255, 154, 162)',
                    'rgb(181, 234, 215)',
                    'rgb(199, 206, 234)',
                    'rgb(255, 154, 162)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Probability'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Class Probabilities'
                }
            }
        }
    });

    // Handle form submission
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // // Get the selected file
        // const file = image_upload.files[0];
        //
        // if (!file) {
        //     alert("Please select a file.");
        //     return;
        // }
        //
        // // Create a temporary URL for the file
        // const fileUrl = URL.createObjectURL(file);
        //
        // // Use the file name and temporary URL as the "path"
        // const features = [
        //     fileUrl + '/' + file.name
        // ];


        // Get input values
        const features = [
            // URL.createObjectURL(image_upload.value)
            image_upload.value
            // document.getElementById("image_upload").files[0].name
            // this.getElementsByClassName("form-group").item(1).files[0]
        ];

        // Make prediction request
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ features: features }),
        })
        .then(response => response.json())
        .then(data => {
            // Display result
            displayPredictionResult(data, features);
            // Update chart
            updateProbabilityChart(data.probabilities);
        })
        .catch(error => {
            predictionResultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        });
    });

    // Handle example buttons
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imagePath = this.dataset.image;

            image_upload.value = imagePath;
            
            // Submit form
            predictionForm.dispatchEvent(new Event('submit'));
        });
    });

    // Function to display prediction result
    function displayPredictionResult(data, features) {
        const timestamp = new Date().getTime();

        const result = `
            <div class="processed" data-image="static/Processed.png">
                <img src="static/Processed.png?t=${timestamp}" alt="Processed Image"/>
            </div>

            <h3>Prediction: <span class="prediction-class">${data.class_name}</span></h3>
            <p>Based on the following measurements:</p>
            <ul>
                <li>File Path: ${features[0]}</li>
            </ul>
            <p>Confidence: ${(data.probabilities[data.class_name] * 100).toFixed(2)}%</p>
        `;
        
        predictionResultDiv.innerHTML = result;
    }

    // Function to update probability chart
    function updateProbabilityChart(probabilities) {
        const data = [
            probabilities.n0 || 0,
            probabilities.n1 || 0,
            probabilities.n2 || 0,
            probabilities.n3 || 0,
            probabilities.n4 || 0,
            probabilities.n5 || 0,
            probabilities.n6 || 0,
            probabilities.n7 || 0,
            probabilities.n8 || 0,
            probabilities.n9 || 0,
        ];
        
        probabilityChart.data.datasets[0].data = data;
        probabilityChart.update();
    }
});