import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhoneAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const ConsultForm = () => {
  return (
    <Form className="consult-form">
      <Form.Group
        controlId="name"
        className="consult-form__group"
      >
        <Form.Label className="consult-form__label">
          <FontAwesomeIcon
            icon={faUser}
            className="consult-form__icon"
          />{" "}
          Họ và tên
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập họ tên của bạn"
          className="consult-form__input"
        />
      </Form.Group>

      <Form.Group
        controlId="email"
        className="consult-form__group"
      >
        <Form.Label className="consult-form__label">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="consult-form__icon"
          />{" "}
          Email
        </Form.Label>
        <Form.Control
          type="email"
          placeholder="Nhập email"
          className="consult-form__input"
        />
      </Form.Group>

      <Form.Group
        controlId="phone"
        className="consult-form__group"
      >
        <Form.Label className="consult-form__label">
          <FontAwesomeIcon
            icon={faPhoneAlt}
            className="consult-form__icon"
          />{" "}
          Số điện thoại
        </Form.Label>
        <Form.Control
          type="tel"
          placeholder="Nhập số điện thoại"
          className="consult-form__input"
        />
      </Form.Group>

      <Form.Group
        controlId="message"
        className="consult-form__group"
      >
        <Form.Label className="consult-form__label">
          <FontAwesomeIcon
            icon={faEdit}
            className="consult-form__icon"
          />{" "}
          Nội dung tư vấn
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Bạn cần tư vấn về gì?"
          className="consult-form__input"
        />
      </Form.Group>

      <Button
        variant="warning"
        type="submit"
        className="consult-form__button mt-3 w-100"
      >
        Gửi đăng ký
      </Button>
    </Form>
  );
};

export default ConsultForm;
