//Function to show a specific section and hide others
function showSection113(sectionId) { 
    
 const sections = document.querySelectorAll('main section');
   
 sections.forEach(section => {
      
 section.style.display = 'none';
   
    });
   
    document.getElementById(sectionId).style.display = 'block';
}

//show the parts section
document.addEventListener('DOMContentLoaded', () => {

    showSection113('partsSection'); 

});

// Function to list all parts
function listParts113() { 

    fetch('http://localhost:3000/api/parts')
        .then(response => response.json())

        .then(data => {
    let partsList = '<ul>';

     data.forEach(part => {

         partsList += `<li>${part.partNo113} | ${part.partName113} | ${part.currentPrice113}</li>`;

            });

         partsList += '</ul>';
         document.getElementById('partsList').innerHTML = partsList;

        })
        .catch(error => console.error('Error fetching parts:', error));
}

//Function to list all purchase orders
function listPOs113() { 
    fetch('http://localhost:3000/api/purchase-orders')
        .then(response => response.json())
        .then(data => {

            let poList = '';

            data.forEach(po => {
                poList += `

              <div class="po-item">
               <p><strong>PO Number:</strong> ${po.poNo113}</p>
              <p><strong>Client ID:</strong> ${po.clientCompID113}</p>
               <p><strong>Date of PO:</strong> ${new Date(po.dateOfPO113).toLocaleString()}</p>
               <p><strong>Status:</strong> ${po.status113}</p>
                 </div>
                  <hr>`;

            });
            document.getElementById('poList').innerHTML = poList;
        })
        .catch(error => console.error('Error fetching purchase orders:', error));
}

//Function to get details of a specific purchase order
function getPODetails113() {

    const poNumber = document.getElementById('poNumber').value;
    fetch(`http://localhost:3000/api/purchase-orders/${poNumber}`)
        .then(response => response.json())
        .then(data => {

        let poDetails = `<p><strong>PO Number:</strong> ${data.poNo113}</p>`;
        poDetails += `<p><strong>Client ID:</strong> ${data.clientCompID113}</p>`;
        poDetails += `<p><strong>Date of PO:</strong> ${new Date(data.dateOfPO113).toLocaleString()}</p>`;
         poDetails += `<p><strong>Status:</strong> ${data.status113}</p>`;
         poDetails += '<h3>Line Items</h3>';
         poDetails += '<ul>';
         data.lines.forEach(line => {

                poDetails += `

                    <li>
                        <p><strong>Line Number:</strong> ${line.lineNo113}</p>
                        <p><strong>Part Number:</strong> ${line.partNo113}</p>
                        <p><strong>Quantity:</strong> ${line.qty113}</p>
                        <p><strong>Price Ordered:</strong> ${line.priceOrdered113}</p>
                    </li>
                    <hr>`;
            });

            poDetails += '</ul>';
            document.getElementById('poDetails').innerHTML = poDetails;

        })

        .catch(error => console.error('Error fetching PO details:', error));
}

//Function to prepare a new purchase order
function preparePO113() { 

const clientCompID113 = document.getElementById('clientID').value;
const dateOfPO113 = document.getElementById('poDate').value;
const qty113 = document.getElementById('quantity').value;
 const partNo113 = document.getElementById('partNumber').value;

    fetch('/api/prepare-po113', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ clientCompID113, dateOfPO113, qty113, partNo113 })

    })
    .then(response => response.json())

    .then(data => {

 if (data.poNumber) {
            document.getElementById('preparedPoNumber').innerText = `Prepared PO Number: ${data.poNumber}`;
        } 
        
    else {
            alert(data.message || 'Error preparing PO');
            console.error('Error details:', data.error);
        }
    })

    .catch(error => {

        console.error('Error:', error);

        alert('Error preparing PO');

    });
}


//Function to submit a purchase order
function submitPO113() { 

    const poNumber = document.getElementById('poNumberSubmit').value;

    fetch(`http://localhost:3000/api/purchase-orders113/${poNumber}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })

    .then(response => response.json())
    .then(data => {

 if (data.success) {
            document.getElementById('submitStatus').innerText = `PO ${data.poNumber} submitted successfully`;
        } 
        
    else {
            document.getElementById('submitStatus').innerText = 'Error submitting PO. Please try again.';
        }
    })

    .catch(error => {

        console.error('Error submitting PO:', error);

        document.getElementById('submitStatus').innerText = 'Error submitting PO. Please try again.';
        
    });
}
