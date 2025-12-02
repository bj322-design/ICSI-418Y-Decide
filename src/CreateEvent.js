import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();

    const [eventName, setEventName] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [eventAdmissionPrice, setEventPrice] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const [eventPromoImage, setEventPromoImage] = useState(null);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        setEventPromoImage(e.target.files[0]);
    }

    useEffect(() => {
        document.title = 'Create Event';
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // FormData for promo image
        const formData = new FormData();

        // Append text fields
        formData.append('event_name', eventName);
        formData.append('event_location', eventLocation);
        formData.append('event_start', eventStart);
        formData.append('event_end', eventEnd);
        formData.append('event_price', eventAdmissionPrice);
        formData.append('event_desc', eventDescription);

        setMessage(null);

        if (eventPromoImage) {
            formData.append('event_promo', eventPromoImage);
        }

        if (!eventName || !eventLocation || !eventStart || !eventEnd) {
            setMessage({ type: 'error', text: 'Event Name, Event Location, and Event Start/End Times are required.' });
            return;
        }

        axios.post('http://localhost:9000/createEvent', formData).then(() => {
            setMessage({ type: 'success', text: `Event "${eventName}" successfully created! Redirecting...` });

            setTimeout(() => {
                navigate('/HostHome');
            }, 1500);
        })
            .catch((err) => {
                console.error('Event creation failed: ', err);
                setMessage({ type: 'error', text: 'Error in creating event.' });
            });
    };

    return (
        <div className="page-wrapper">
            <div className="login-container">
                <h1>Create New Event</h1>
                <form onSubmit={handleSubmit}>

                    {/* Submission Message Display */}
                    {message && (
                        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
                            {message.text}
                        </div>
                    )}

                    {/* Event Name - Input text */}
                    <div className="input-group">
                        <label htmlFor="eventName">Event Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="eventName"
                            required
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                    </div>

                    {/* Event Location - Input text */}
                    <div className="input-group">
                        <label htmlFor="eventLocation">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="eventLocation"
                            required
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                        />
                    </div>

                    {/* Event Date/Time Start - Input datetime */}
                    <div className="input-group">
                        <label htmlFor="eventStart">Event Start Date/Time:</label>
                        <input
                            type="datetime-local"
                            id="start_time"
                            name="eventStart"
                            required
                            value={eventStart}
                            onChange={(e) => setEventStart(e.target.value)}
                        />
                    </div>

                    {/* Event Date/Time End - Input datetime */}
                    <div className="input-group">
                        <label htmlFor="eventEnd">Event End Date/Time:</label>
                        <input
                            type="datetime-local"
                            id="end_time"
                            name="eventEnd"
                            required
                            value={eventEnd}
                            onChange={(e) => setEventEnd(e.target.value)}
                        />
                    </div>

                    {/* Event Admission Price - $Input text */}
                    <div className="input-group">
                        <label htmlFor="eventAdmissionPrice">Admission Price:</label>
                        <input
                            type="text"
                            id="admission_price"
                            name="eventAdmissionPrice"
                            placeholder="$"
                            value={eventAdmissionPrice}
                            onChange={(e) => setEventPrice(e.target.value)}
                        />
                    </div>

                    {/* Event Description - Textarea */}
                    <div className="input-group">
                        <label htmlFor="eventDescription">Event Description:</label>
                        <textarea
                            id="description"
                            name="eventDescription"
                            rows="4" // Set initial height
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            className="textarea-input" // Custom class for styling consistency
                        />
                    </div>

                    {/* Event Promotional Image - Input image */}
                    <div className="input-group">
                        <label htmlFor="eventPromoImage">Promotional Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="promo_image"
                            name="eventPromoImage"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit">Create Event</button>
                </form>

                <Link to="/HostHome" className="back-link">← Back to Dashboard</Link>
            </div>

            <style>{`
                /* A modern, clean stylesheet for the form */
                .page-wrapper {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    line-height: 1.6;
                }

                /* Main container for the form (reusing login-container class) */
                .login-container {
                    background-color: #ffffff;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 420px;
                    text-align: center;
                    border: 1px solid #e0e2e5;
                }

                /* Heading styles */
                h1 {
                    color: #333;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                    font-weight: 700;
                }

                /* Input group container */
                .input-group {
                    margin-bottom: 1.5rem;
                    text-align: left;
                }

                /* Labels for input fields */
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #555;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                /* Input field styles (for text inputs, textarea, and select) */
                .input-group input, .input-group textarea, .select-input { 
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-sizing: border-box;
                    font-size: 1rem;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    font-family: inherit; 
                    resize: vertical; 
                    background-color: white; 
                }

                .input-group input:focus, .input-group textarea:focus, .select-input:focus { 
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
                    outline: none;
                }

                /* Submit button */
                button[type="submit"] {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                    margin-top: 1.5rem; /* Added margin for separation */
                }

                button[type="submit"]:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                }

                /* Fallback button style (removed type="button" from final button) */
                button {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }

                /* Error Message Style */
                .error-message {
                    background-color: #ffebeb;
                    color: #d8000c;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #d8000c;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: left;
                }

                /* Success Message Style (New) */
                .success-message {
                    background-color: #e6ffed;
                    color: #008744;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #008744;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    text-align: left;
                }
            `}</style>
        </div>
    );
};

export default CreateEvent;