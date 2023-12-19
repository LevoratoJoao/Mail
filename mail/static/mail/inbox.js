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

		emails.forEach(element => {
			const p = document.createElement('p');
			if (mailbox == 'sent') {
				p.innerHTML = `<button class="list-group-item list-group-item-action list-group-item-secondary" id="inbox">Subject: ${element['subject']}<br>To: ${element['recipients']} - ${element['timestamp']}</button>`
			} else {
				if (element['read'] == true) {
					p.innerHTML = `<button class="list-group-item list-group-item-action list-group-item-secondary" id="inbox">Subject: ${element['subject']}<br>Sender: ${element['sender']} - ${element['timestamp']}</button>`
				} else {
					p.innerHTML = `<button class="list-group-item list-group-item-action" id="inbox">Subject: ${element['subject']}<br>Sender: ${element['sender']} - ${element['timestamp']}</button>`
				}
			}
			p.addEventListener('click', () => load_mail(element['id'], mailbox));
			email_div.appendChild(p);
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
		document.querySelector('#compose-subject').value = email['subject'];
		document.querySelector('#compose-recipients').value = email['sender'];
		document.querySelector('#compose-body').value = `On ${email['timestamp']} ${email['sender']} wrote: ${email['body']}`;
	})

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
		document.querySelector('#emails-view').innerHTML = `<h3>${email.subject}</h3>`;

		const email_div = document.createElement('div');
		email_div.id = '#emails-object';

		document.querySelector('#emails-view').append(email_div);

		const p = document.createElement('p');
		p.innerHTML = `Sender: ${email['sender']} - ${email['timestamp']}<br>Body: ${email['body']}`;
		email_div.appendChild(p);

		if (mailbox != 'sent') {
			archive_mail(email, email_div);
		}
		reply_mail(email, email_div);

		// document.querySelector('#reply-form').onsubmit = () => {
		// 	fetch('/emails', {
		// 		method: 'POST',
		// 		body: JSON.stringify({
		// 			subject: document.querySelector('#compose-recipients').value,
		// 			body: document.querySelector('#compose-body').value
		// 		})
		// 	  })
		// 	  .then(response => response.json())
		// 	  .then(result => {
		// 		  // Print result
		// 		  console.log(result);
		// 	  });
		// };
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