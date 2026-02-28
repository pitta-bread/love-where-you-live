from app.core.settings import settings


def request_headers(
    user_email: str = 'peterbeardsmore@gmail.com',
    backend_secret: str | None = None,
) -> dict[str, str]:
    headers = {'x-user-email': user_email}
    if backend_secret:
        headers['x-backend-secret'] = backend_secret
    return headers


def test_create_and_list_anchors(client):
    payload = {
        'name': 'Temple Quay Office',
        'address': '1 Glass Wharf, Bristol BS2 0EL',
        'mode': 'transit',
        'frequency_per_week': 5,
        'importance_weight': 5,
    }

    create_response = client.post(
        '/api/v1/anchors', json=payload, headers=request_headers()
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created['id'] == 1
    assert created['name'] == payload['name']
    assert created['address'] == payload['address']
    assert created['mode'] == payload['mode']

    list_response = client.get('/api/v1/anchors', headers=request_headers())

    assert list_response.status_code == 200
    anchors = list_response.json()
    assert len(anchors) == 1
    assert anchors[0]['name'] == payload['name']


def test_anchors_are_scoped_to_user_email(client):
    user_one_payload = {
        'name': 'Temple Quay Office',
        'address': '1 Glass Wharf, Bristol BS2 0EL',
        'mode': 'transit',
        'frequency_per_week': 5,
        'importance_weight': 5,
    }
    user_two_payload = {
        'name': 'Parent pickup',
        'address': 'Redland, Bristol BS6',
        'mode': 'drive',
        'frequency_per_week': 3,
        'importance_weight': 4,
    }

    create_response_user_one = client.post(
        '/api/v1/anchors',
        json=user_one_payload,
        headers=request_headers(user_email='user.one@example.com'),
    )
    create_response_user_two = client.post(
        '/api/v1/anchors',
        json=user_two_payload,
        headers=request_headers(user_email='user.two@example.com'),
    )

    assert create_response_user_one.status_code == 201
    assert create_response_user_two.status_code == 201

    list_response_user_one = client.get(
        '/api/v1/anchors', headers=request_headers(user_email='user.one@example.com')
    )
    list_response_user_two = client.get(
        '/api/v1/anchors', headers=request_headers(user_email='user.two@example.com')
    )

    assert list_response_user_one.status_code == 200
    assert list_response_user_two.status_code == 200
    assert [anchor['name'] for anchor in list_response_user_one.json()] == [
        'Temple Quay Office'
    ]
    assert [anchor['name'] for anchor in list_response_user_two.json()] == [
        'Parent pickup'
    ]


def test_anchors_require_user_email_header(client):
    response_without_header = client.get('/api/v1/anchors')
    response_with_invalid_email = client.get(
        '/api/v1/anchors', headers={'x-user-email': 'invalid-email'}
    )

    assert response_without_header.status_code == 400
    assert response_with_invalid_email.status_code == 400


def test_anchors_require_shared_secret_when_configured(client):
    settings.api_shared_secret = 'test-secret'

    response_without_secret = client.get(
        '/api/v1/anchors',
        headers=request_headers(),
    )
    response_with_wrong_secret = client.get(
        '/api/v1/anchors',
        headers=request_headers(backend_secret='wrong-secret'),
    )
    response_with_secret = client.get(
        '/api/v1/anchors',
        headers=request_headers(backend_secret='test-secret'),
    )

    assert response_without_secret.status_code == 403
    assert response_with_wrong_secret.status_code == 403
    assert response_with_secret.status_code == 200
