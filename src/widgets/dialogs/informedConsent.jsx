import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

export default function InformedConsentModal(props) {
  const [consentChoice, setConsentChoice] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const condition = Math.floor(Math.random() * 2) + 12;

  const handleConsent = (e) => {
    setIsLoading(true);
    if (consentChoice === 'consent') {
      props.consentCallback(true, condition);
    } else {
      // Reset the form
      setConsentChoice('');
      // setName('');
      // setDate('');
      setIsLoading(false);
      // Notify parent component that user didn't consent
      props.onClose(false);
    }
  }

  const handleClose = () => {
    // Reset the form
    setConsentChoice('');
    // setName('');
    // setDate('');
    // Notify parent component to close the modal
    props.onClose(false);
  }

  return (
    <Modal show={props.show} onHide={handleClose} dialogClassName="modal-80w" style={{ zIndex: "2050" }}>
      <Modal.Header>
        <Modal.Title>
          Clemson University<br />
          The Peer Recommendation Platform
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='informedConsent-title'>
          Key Information About the Research Study
        </p>
        <p>
          Dr. Bart Knijnenburg is inviting you to volunteer for a 
          research study. Bart  Knijnenburg is an assistant professor 
          at Clemson University conducting the study with  one of his 
          graduate students, Mina Mbodj, at Clemson University. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Study Purpose:&nbsp;
          </span>
          The purpose of this research is to investigate how a 
          peer-based recommendation system works and the behaviors 
          that it elicits in members of the community. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Voluntary Consent:&nbsp;
          </span>
          Participation is voluntary, and you have the option to not 
          participate. You will not be punished in any way if you 
          decide not to be in the study  or to stop taking part in the 
          study. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Activities and Procedures:&nbsp;
          </span>
          You will be provided a consent form that you will have to 
          sign to agree to the terms and conditions. Once you sign the 
          consent form, you will be  asked to complete the pre-survey, 
          read through The Peer Recommendation Platform introduction 
          page. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Participation Time:&nbsp;
          </span>
          It will take you about 65 minutes to be part of this study. 
        </p>

        <p>
          <span className='informedConsent-bold'>
            Risks and Discomforts:&nbsp;
          </span>
          We do not know of any risks or discomforts to you in this 
          research study. You may opt out of the study at any time if 
          you are not comfortable. 
        </p>
        <p>
          <span className='informedConsent-bold'>
            Possible Benefits:&nbsp;
          </span>
          You may not benefit directly for taking part in this study; 
          however,  we believe that this system will help you help. 
        </p>

        <p className='informedConsent-title'>Incentives</p>
        <p>
          For participating in this user study, you will be 
          compensated with TBD upon successful  completion of the 
          study. 
        </p>

        <p className='informedConsent-title'>
          Audio/Video Recording and Photographs
        </p>
        <p>
        Our study does not ask you to provide personal or identifiable 
        information. No audio or video will be recorded while 
        participants will take the study. 
        </p>

        <p className='informedConsent-title'>
          Equipment and Devices that will be used in Research Study
        </p>
        <p>
          Are required: a computer, Internet browser and internet 
          connection to access the survey and take  the experiment. 
        </p>
        
        <p className='informedConsent-title'>
          Protection of Privacy and Confidentiality
        </p>
        <p>
        The results of this study may be published in scientific 
        journals, professional  publications, or educational 
        presentations. Identifiable information collected during  
        the study will be removed and the de-identified information will 
        not be used or  distributed for future research studies. 
        We might be required to share the information  we collect from 
        you with the Clemson University Office of Research Compliance and  
        the federal Office for Human Research Protections. If this happens, 
        the information  would only be used to find out if we ran this 
        study properly and protected your rights  in the study. 
        </p>

        <p className='informedConsent-title'>
          Contact Information
        </p>
        <p>
          If you have any questions or concerns about your rights in this research study, 
          please  contact the Clemson University Office of Research Compliance (ORC) at 
          864-656- 0636 or <a href="mailto:irb@clemson.edu">irb@clemson.edu</a>. The 
          Clemson IRB will not be able to answer some study specific questions. However, 
          you may contact the Clemson IRB if the research staff  cannot be reached or if 
          you wish to speak with someone other than the research staff. 
        </p>
        <p>
          If you have any study related questions or if any problem arise, please contact
          Dr. Bart Knijnenburg (<a href="mailto:bartk@clemson.edu">bartk@clemson.edu</a>).
          Mina Mbodj <a href="mailto:ambodj@g.clemson.edu">ambodj@g.clemson.edu</a>.
        </p>

        <Form className="consent-form">
          <p className="informedConsent-title">Consent</p>

          {/* <Form.Group controlId="nameInput">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="dateInput">
            <Form.Label>Date:</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group> */}

          <div style={{ 
            border: '2px solid #f9b05c', 
            borderRadius: '5px', 
            padding: '15px', 
            marginTop: '20px',
            backgroundColor: '#fff9e6'
          }}>
            <p className="informedConsent-bold" style={{ color: '#d9534f' }}>
              IMPORTANT: Please carefully read and select one of the following options:
            </p>

            <Form.Check
              type="radio"
              id="consentChoice1"
              label="I consent to being a participant in this study and the use of my educational records for research purposes."
              name="consentGroup"
              value="consent"
              checked={consentChoice === 'consent'}
              onChange={(e) => setConsentChoice(e.target.value)}
            />

            <Form.Check
              type="radio"
              id="consentChoice2"
              label="I DO NOT consent to being a participant in this study and the use of my educational records for research purposes."
              name="consentGroup"
              value="doNotConsent"
              checked={consentChoice === 'doNotConsent'}
              onChange={(e) => setConsentChoice(e.target.value)}
            />
          </div>

          {!consentChoice && (
            <p style={{ color: '#d9534f', marginTop: '10px' }}>
              You must select one of the above options to proceed.
            </p>
          )}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ersCancel" onClick={handleClose}>
          Exit
        </Button>
        <Button 
          variant="ers" 
          disabled={!consentChoice || isLoading}
          onClick={handleConsent}
        >
          {!isLoading ? 'Continue' : 
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </>
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
}