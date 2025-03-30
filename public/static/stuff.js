function deleteitems(end,id){
    //send a delete request in /api/tables/end/id
      fetch(`/api/tables/${end}/${id}/`, {
             method: 'DELETE',
             headers: {
              'Content-Type': 'application/json',
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log('Success:', data);
             location.reload();
         })
         .catch((error) => {
             console.error('Error:', error);
         });
 }
function publishitems(end, id, ele) {
    // Determine the is_published value based on the checkbox state
    const isPublished = ele.checked;

    // Send a PATCH request with is_published data parameter
    fetch(`/api/tables/${end}/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            is_published: isPublished
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}