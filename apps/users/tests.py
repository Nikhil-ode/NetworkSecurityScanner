from django.contrib.auth.models import User
from django.test import Client, TestCase


class SessionLoginTests(TestCase):
    def setUp(self):
        self.password = 'SafePassword123!'
        self.user = User.objects.create_user(
            username='session_login_user',
            password=self.password,
        )

    def test_login_creates_a_session_that_can_access_the_current_user(self):
        client = Client(enforce_csrf_checks=True)
        csrf_response = client.get('/api/auth/csrf/')

        self.assertEqual(csrf_response.status_code, 200)
        self.assertIn('csrftoken', csrf_response.cookies)

        login_response = client.post(
            '/api/auth/session-login/',
            data={
                'username': self.user.username,
                'password': self.password,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrf_response.cookies['csrftoken'].value,
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()['user']['username'], self.user.username)

        current_user_response = client.get('/api/auth/users/me/')
        self.assertEqual(current_user_response.status_code, 200)
        self.assertEqual(current_user_response.json()['username'], self.user.username)

    def test_duplicate_api_prefix_redirects_to_the_actual_endpoint(self):
        response = self.client.get('/api/api/auth/users/me/?source=legacy')

        self.assertEqual(response.status_code, 307)
        self.assertEqual(response['Location'], '/api/auth/users/me/?source=legacy')
