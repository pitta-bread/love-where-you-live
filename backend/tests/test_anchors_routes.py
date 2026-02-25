from app.core.settings import settings


def test_create_and_list_anchors(client):
    payload = {
        'name': 'Temple Quay Office',
        'address': '1 Glass Wharf, Bristol BS2 0EL',
        'mode': 'transit',
        'frequency_per_week': 5,
        'importance_weight': 5,
    }

    create_response = client.post('/api/v1/anchors', json=payload)

    assert create_response.status_code == 201
    created = create_response.json()
    assert created['id'] == 1
    assert created['name'] == payload['name']
    assert created['address'] == payload['address']
    assert created['mode'] == payload['mode']

    list_response = client.get('/api/v1/anchors')

    assert list_response.status_code == 200
    anchors = list_response.json()
    assert len(anchors) == 1
    assert anchors[0]['name'] == payload['name']


def test_anchors_require_shared_secret_when_configured(client):
    settings.api_shared_secret = 'test-secret'

    response_without_secret = client.get('/api/v1/anchors')
    response_with_wrong_secret = client.get(
        '/api/v1/anchors', headers={'x-backend-secret': 'wrong-secret'}
    )
    response_with_secret = client.get(
        '/api/v1/anchors', headers={'x-backend-secret': 'test-secret'}
    )

    assert response_without_secret.status_code == 403
    assert response_with_wrong_secret.status_code == 403
    assert response_with_secret.status_code == 200
