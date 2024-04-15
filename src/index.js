const baseURL = "http://localhost:3000/films";
function getMovies() {
    fetch(baseURL)
      .then(response => response.json())
      .then(data => {
        const filmsList = document.getElementById('films'); // Get reference to the ul element
  
        // Clear any existing content in the filmsList
        filmsList.innerHTML = '';
  
        data.forEach(movie => {
          const li = document.createElement('li');
          li.classList.add('film', 'item');

          // Create text content for the li element
          li.textContent = movie.title;

          
          // Create a delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
  
          // Add a click event listener to the delete button
          deleteButton.addEventListener('click', function() {
            // Send request to delete movie on backend
            const movieId = movie.id; // Assuming you have a movie ID
            fetch(`${baseURL}/${movieId}`, {
              method: 'DELETE'
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to delete movie.');
              }
              // Remove the li element from the DOM
              li.remove();
            })
            .catch(error => console.error('Error deleting movie:', error));
          });
  
          // Append the delete button to the li element
          li.appendChild(deleteButton);
  
          // Append the new li to the ul
          filmsList.appendChild(li);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Call getMovies to fetch data and update the HTML
  getMovies();
  
function firstMovie() {
    fetch(baseURL)
        .then(response => response.json())
        .then(data => {
            const movie = data[0]; // Assuming you want information for the first movie in the list
            // Extract movie information
            const title = movie.title;
            const runtime = movie.runtime;
            const description = movie.description; // Assuming there is a 'description' property in your data
            const showtime = movie.showtime;
            const capacity = movie.capacity;
            let availableTickets = capacity - movie.tickets_sold;
            const poster = movie.poster;
            // Update HTML elements with movie information
            document.getElementById('poster').src = poster;
            document.getElementById('title').textContent = title;
            document.getElementById('runtime').textContent = `${runtime} minutes`;
            document.getElementById('film-info').textContent = description;
            document.getElementById('showtime').textContent = showtime;
            const ticketNumElement = document.getElementById('ticket-num');
            ticketNumElement.textContent = `${availableTickets}`;
            // Function to handle buying tickets
            const buyTicketHandler = function () {
                if (availableTickets > 0) {
                    availableTickets--; // Decrement availableTickets
                    ticketNumElement.textContent = `${availableTickets}`; // Update HTML
                    // Send request to update tickets_sold count on backend
                    const movieId = 0; // Assuming you have a movie ID
                    const ticketsSold = ticketNumElement.textContent;
                    // Send PATCH request to update tickets_sold count
                    fetch(`${baseURL}/${movieId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tickets_sold: ticketsSold })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to update tickets_sold count.');
                            }
                            // Handle success response here if needed
                        })
                        .catch(error => console.error('Error updating tickets_sold count:', error));
                } else {
                    alert('Tickets are sold out!');
                    // Update buy button to "Sold Out"
                    const buyButton = document.getElementById('buy-ticket');
                    buyButton.textContent = 'Sold Out';
                    buyButton.disabled = true; // Optionally disable the button
                }
            };
            // Add event listener to buy button
            document.getElementById('buy-ticket').addEventListener('click', buyTicketHandler);
        })
        .catch(error => console.error('Error fetching data:', error));
}
// Call firstMovie to fetch data and update the HTML
firstMovie();``