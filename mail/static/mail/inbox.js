document.addEventListener('DOMContentLoaded', function() {

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
	document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
	document.querySelector('#compose').addEventListener('click', compose_email);

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

	document.querySelector('#compose-form').onsubmit = () => {
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
		  });
	};
  }

  function load_mailbox(mailbox) {

	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';

	// Show the mailbox name
	document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
	fetch('/emails/inbox')
	.then(response => response.json())
	.then(emails => {
		// Print emails
		console.log(emails);

		const email_div = document.createElement('div');
		email_div.id = '#emails-object';

		document.querySelector('#emails-view').append(email_div);

		emails.forEach(element => {
			const p = document.createElement('p');
			if (mailbox == 'inbox') {
				p.innerHTML = `<button class="btn btn-sm btn-outline-primary btn-lg btn-block" id="inbox">Subject: ${element['subject']}<br>Sender: ${element['sender']}</button>`
				p.addEventListener('click', () => load_mail(element['id']));
				email_div.appendChild(p);
			} else if (mailbox == 'archive' && element['archived'] == true) {
				p.innerHTML = `<button class="btn btn-sm btn-outline-primary btn-lg btn-block" id="inbox">Subject: ${element['subject']}<br>Sender: ${element['sender']}</button>`
				p.addEventListener('click', () => load_mail(element['id']));
				email_div.appendChild(p);
			}
		});
	});
  }

  function load_mail(id) {
	// Show the mailbox and hide other views
	document.querySelector('#emails-view').style.display = 'block';
	document.querySelector('#compose-view').style.display = 'none';

	fetch(`/emails/${id}`)
	.then(response => response.json())
	.then(email => {
		// Print email
		console.log(email);

		fetch(`/emails/${id}`, {
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

		const archive_form = document.createElement('form');
		archive_form.setAttribute('id', 'archive-form');

		const archive_button = document.createElement('input');
		archive_button.setAttribute('id', 'archive-button');
		archive_button.setAttribute('value', 'archive');
		archive_button.setAttribute('type', 'submit');
		archive_button.setAttribute('class', 'btn btn-primary');

		archive_form.appendChild(archive_button);

		email_div.appendChild(archive_form);

		document.querySelector('#archive-form').onsubmit = () => {
			fetch(`/emails/${id}`,  {
				method: 'PUT',
				body: JSON.stringify({
					archived: true
				})
			  }).then(result => {
				  // Print result
				  console.log(result);
			  });
		};

		const reply_form = document.createElement('form');
		reply_form.setAttribute('id', 'reply-form');

		const input = document.createElement('input');
		input.disabled = true;
		input.setAttribute('id', 'compose-recipients');
		input.setAttribute('class', 'form-control');
		input.setAttribute('value', `${email['sender']}`);
		reply_form.appendChild(input);

		const textarea = document.createElement('textarea');
		textarea.setAttribute('class', 'form-control');
		textarea.setAttribute('id', 'compose-body');
		textarea.setAttribute('placeholder', 'body');
		reply_form.appendChild(textarea);

		const submit = document.createElement('input');
		submit.setAttribute('id', 'reply-button');
		submit.setAttribute('value', 'reply');
		submit.setAttribute('type', 'submit');
		submit.setAttribute('class', 'btn btn-primary');
		reply_form.appendChild(submit);

		email_div.appendChild(reply_form);

		document.querySelector('#reply-form').onsubmit = () => {
			fetch('/emails', {
				method: 'POST',
				body: JSON.stringify({
					subject: document.querySelector('#compose-recipients').value,
					body: document.querySelector('#compose-body').value
				})
			  })
			  .then(response => response.json())
			  .then(result => {
				  // Print result
				  console.log(result);
			  });
		};
	});
  }

  function send_email() {
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
	  });
  }