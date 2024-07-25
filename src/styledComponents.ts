import styled from 'styled-components';

export const Container = styled.div`
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    width: 100%;
    max-width: 500px;
    margin-top: 2rem;
`;

export const Title = styled.h1`
    text-align: center;
`;

export const Subtitle = styled.h2`
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const Input = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const Button = styled.button`
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: var(--marian-blue);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--space-cadet);
    }
`;

export const TaskList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const TaskItem = styled.li<{ $active: boolean }>`
    margin: 0.5rem 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: ${(props) => (props.$active ? '1' : '0.5')};
`;

export const TaskButton = styled.button`
    background-color: var(--true-blue);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--marian-blue);
    }
`;
