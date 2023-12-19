document.addEventListener('DOMContentLoaded', function() {

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

	document.querySelector('#compose-form').addEventListener('submit', send_email);

	// By default, load the inbox
	load_mailbox('inbox');
  });

  function compose_email() {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'block';

	// Clear out composition fields
	document.querySelector('#compose-recipients').value = '';
	document.querySelector('#compose-subject').value = '';
	document.querySelector('#compose-body').value = '';

  }

  function load_mailbox(mailbox) {

	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';

	// Show the mailbox name
	document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
	fetch(`/emails/${mailbox}`)
	.then(response => response.json())
	.then(emails => {
		// Print emails
		console.log(emails);

		const email_div = document.createElement('div');
		email_div.id = '#emails-object';
		document.querySelector('#emails-view').append(email_div);

		const div_list = document.createElement('div');
		div_list.className = 'list-group';
		email_div.appendChild(div_list);

		emails.forEach(element => {
			const button = document.createElement('a');
			button.setAttribute('href', '#');
			div_list.appendChild(button);
			if (mailbox == 'sent') {
				button.className = 'list-group-item list-group-item-action flex-column align-items-start list-group-item-secondary';
				button.innerHTML = `<div class="d-flex w-100 justify-content-between">
										<h5 class="mb-1">${element['subject']}</h5>
										<small>${element['timestamp']}</small>
			  						</div>
			  						<p class="mb-1">To: ${element['recipients']}</p>`;
			} else {
				if (element['read'] == true) {
					button.className = 'list-group-item list-group-item-action flex-column align-items-start list-group-item-secondary';
					button.innerHTML = `<div class="d-flex w-100 justify-content-between">
											<h5 class="mb-1">${element['subject']}</h5>
											<small>${element['timestamp']}</small>
										  </div>
										  <p class="mb-1">Sender: ${element['sender']}</p>`;
				} else {
					button.className = 'list-group-item list-group-item-action flex-column align-items-start';
					button.innerHTML = `<div class="d-flex w-100 justify-content-between">
											<h5 class="mb-1" style="margin-right: 10px">${element['subject']}</h5>
											<small>${element['timestamp']}</small>
										  </div>
										  <p class="mb-1">Sender: ${element['sender']}</p>`;
				}
			}
			button.addEventListener('click', () => load_mail(element['id'], mailbox));
			div_list.appendChild(button);
		});
	});
  }

  function archive_mail(email, email_div) {
	const archive_button = document.createElement('button');
	archive_button.style.marginRight = '10px';
	archive_button.innerHTML = 'Archive';
	archive_button.setAttribute('type', 'button');
	archive_button.setAttribute('class', 'btn btn-primary btn-lg');

	if (email['archived'] == true) {
		archive_button.innerHTML = 'unarchive';
	} else {
		archive_button.innerHTML = 'archive';
	}
	archive_button.addEventListener('click', () => {
		fetch(`/emails/${email['id']}`,  {
			method: 'PUT',
			body: JSON.stringify({
				archived: !email['archived']
			})
		  }).then(result => {
			  // Print result
			  console.log(result);
			  load_mailbox('archive');
		  });
	});
	email_div.appendChild(archive_button);
  }

  function reply_mail(email, email_div) {

	const reply_button = document.createElement('button');
	reply_button.innerHTML = 'Reply';
	reply_button.setAttribute('type', 'button');
	reply_button.setAttribute('class', 'btn btn-primary btn-lg');

	reply_button.addEventListener('click', () => {
		compose_email();
		if (!email['subject'].startsWith('Re:')) {
			document.querySelector('#compose-subject').value = 'Re: ' + email['subject'];
		} else {
			document.querySelector('#compose-subject').value = email['subject'];
		}
		document.querySelector('#compose-recipients').value = email['sender'];
		document.querySelector('#compose-body').value = `On ${email['timestamp']} ${email['sender']} wrote: ${email['body']}\n\n`;
	});

	email_div.appendChild(reply_button);
  }

  function load_mail(id, mailbox) {
	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';

	fetch(`/emails/${id}`)
	.then(response => response.json())
	.then(email => {
		// Print email
		console.log(email);

		fetch(`/emails/${email['id']}`, {
			method: 'PUT',
			body: JSON.stringify({
				read: true
			})
		  })
		  .then(result => {
			  // Print result
			  console.log(result);
		  });

		// ... do something else with email ...
		document.querySelector('#emails-view').innerHTML = `<div class="card">
																<div class="card-body">
																	<h3 class="card-title">${email.subject}</h3>
																	<h6 class="card-subtitle mb-2 text-muted">Sender: ${email.sender} - On ${email.timestamp}</h6>
																	<p class="card-text">Wrote: ${email.body}</p>
																</div>
															</div><br>`;

		const email_div = document.createElement('div');
		email_div.id = '#emails-object';

		document.querySelector('#emails-view').append(email_div);

		if (mailbox != 'sent') {
			archive_mail(email, email_div);
		}
		reply_mail(email, email_div);
	});
  }

  function send_email(event) {
	event.preventDefault();
	fetch('/emails', {
		method: 'POST',
		body: JSON.stringify({
			recipients: document.querySelector('#compose-recipients').value,
			subject: document.querySelector('#compose-subject').value,
			body: document.querySelector('#compose-body').value
		})
	  })
	  .then(response => response.json())
	  .then(result => {
		  // Print result
		  console.log(result);
		  load_mailbox('sent');
	  });
  }