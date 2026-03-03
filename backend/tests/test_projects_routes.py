from app.core.settings import settings


def request_headers(
    user_email: str = "peterbeardsmore@gmail.com",
    backend_secret: str | None = None,
) -> dict[str, str]:
    headers = {"x-user-email": user_email}
    if backend_secret:
        headers["x-backend-secret"] = backend_secret
    return headers


def project_payload(
    name: str = "Bristol Move",
    area: str = "Bristol",
    default_transport_mode: str = "drive",
) -> dict[str, str]:
    return {
        "name": name,
        "area": area,
        "default_transport_mode": default_transport_mode,
    }


def test_create_and_list_projects(client):
    create_response = client.post(
        "/api/v1/projects",
        json=project_payload(),
        headers=request_headers(),
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["id"] == 1
    assert created["name"] == "Bristol Move"
    assert created["area"] == "Bristol"
    assert created["default_transport_mode"] == "drive"
    assert created["search_started_at"]
    assert created["created_at"]
    assert created["updated_at"]

    list_response = client.get("/api/v1/projects", headers=request_headers())
    assert list_response.status_code == 200
    assert [project["name"] for project in list_response.json()] == ["Bristol Move"]


def test_projects_are_scoped_to_user_email(client):
    create_response_user_one = client.post(
        "/api/v1/projects",
        json=project_payload(name="User One Move"),
        headers=request_headers(user_email="user.one@example.com"),
    )
    create_response_user_two = client.post(
        "/api/v1/projects",
        json=project_payload(name="User Two Move"),
        headers=request_headers(user_email="user.two@example.com"),
    )

    assert create_response_user_one.status_code == 201
    assert create_response_user_two.status_code == 201

    list_response_user_one = client.get(
        "/api/v1/projects",
        headers=request_headers(user_email="user.one@example.com"),
    )
    list_response_user_two = client.get(
        "/api/v1/projects",
        headers=request_headers(user_email="user.two@example.com"),
    )

    assert [project["name"] for project in list_response_user_one.json()] == [
        "User One Move"
    ]
    assert [project["name"] for project in list_response_user_two.json()] == [
        "User Two Move"
    ]


def test_project_name_uniqueness_is_case_insensitive_per_user(client):
    first_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="  Family Move  "),
        headers=request_headers(user_email="duplicate@example.com"),
    )
    duplicate_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="family move"),
        headers=request_headers(user_email="duplicate@example.com"),
    )

    assert first_response.status_code == 201
    assert first_response.json()["name"] == "Family Move"
    assert duplicate_response.status_code == 409


def test_same_project_name_is_allowed_for_different_users(client):
    user_one_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="Shared Name"),
        headers=request_headers(user_email="user.one@example.com"),
    )
    user_two_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="Shared Name"),
        headers=request_headers(user_email="user.two@example.com"),
    )

    assert user_one_response.status_code == 201
    assert user_two_response.status_code == 201


def test_get_and_delete_projects_enforce_ownership(client):
    user_one_project = client.post(
        "/api/v1/projects",
        json=project_payload(name="My Move"),
        headers=request_headers(user_email="user.one@example.com"),
    ).json()

    own_get_response = client.get(
        f"/api/v1/projects/{user_one_project['id']}",
        headers=request_headers(user_email="user.one@example.com"),
    )
    not_owned_get_response = client.get(
        f"/api/v1/projects/{user_one_project['id']}",
        headers=request_headers(user_email="user.two@example.com"),
    )
    not_owned_delete_response = client.delete(
        f"/api/v1/projects/{user_one_project['id']}",
        headers=request_headers(user_email="user.two@example.com"),
    )
    own_delete_response = client.delete(
        f"/api/v1/projects/{user_one_project['id']}",
        headers=request_headers(user_email="user.one@example.com"),
    )
    after_delete_get_response = client.get(
        f"/api/v1/projects/{user_one_project['id']}",
        headers=request_headers(user_email="user.one@example.com"),
    )

    assert own_get_response.status_code == 200
    assert not_owned_get_response.status_code == 404
    assert not_owned_delete_response.status_code == 404
    assert own_delete_response.status_code == 204
    assert after_delete_get_response.status_code == 404


def test_create_project_rejects_whitespace_only_name_or_area(client):
    empty_name_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="   ", area="Bristol"),
        headers=request_headers(),
    )
    empty_area_response = client.post(
        "/api/v1/projects",
        json=project_payload(name="Move", area=" "),
        headers=request_headers(),
    )

    assert empty_name_response.status_code == 422
    assert empty_area_response.status_code == 422


def test_projects_require_user_email_header(client):
    response_without_header = client.get("/api/v1/projects")
    response_with_invalid_email = client.get(
        "/api/v1/projects",
        headers={"x-user-email": "invalid-email"},
    )

    assert response_without_header.status_code == 400
    assert response_with_invalid_email.status_code == 400


def test_projects_require_shared_secret_when_configured(client):
    settings.api_shared_secret = "test-secret"

    response_without_secret = client.get(
        "/api/v1/projects",
        headers=request_headers(),
    )
    response_with_wrong_secret = client.get(
        "/api/v1/projects",
        headers=request_headers(backend_secret="wrong-secret"),
    )
    response_with_secret = client.get(
        "/api/v1/projects",
        headers=request_headers(backend_secret="test-secret"),
    )

    assert response_without_secret.status_code == 403
    assert response_with_wrong_secret.status_code == 403
    assert response_with_secret.status_code == 200
