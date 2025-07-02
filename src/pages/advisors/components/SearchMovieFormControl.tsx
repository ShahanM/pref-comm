import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Alert, Button, Form, FormControl, Image, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useStudy } from 'rssa-api';
import { Movie } from '../../../widgets/moviegrid/moviegriditem/MovieGridItem.types';
import parse from "html-react-parser";


interface SearchMovieFormControlProps {
	onItemSelected: (selectedMovie: any) => void;
	placeholder?: string;
	formLabel: string;
}

const SearchMovieFormControl: React.FC<SearchMovieFormControlProps> = ({
	onItemSelected,
	placeholder,
	formLabel
}) => {

	const { studyApi } = useStudy();

	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchError, setSearchError] = useState('');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);


	const autoSearch = (query: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (query.trim() !== '') {
			timeoutRef.current = setTimeout(() => {
				studyApi
					.post<{ query: string }, Movie[]>('movies/search', {
						query: query.trim(),
					})
					.then((response) => {
						if (response) {
							setSuggestions(response);
							console.log("Search results: ", response);
						} else {
							setSuggestions([]);
						}
						setLoading(false);
					})
					.catch((error) => {
						console.error('Error fetching movie suggestions:', error);
						setSuggestions([]);
						setSearchError('Failed to fetch suggestions.');
						setLoading(false);
					});
			}, 300);
		} else {
			setSuggestions([]);
			setLoading(false);
		}
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newInputValue = event.target.value;
		setSearchTerm(newInputValue);

		// WARNING: This will trigger a search on every keystroke
		// autoSearch(newInputValue); // Do not commit this line
	};

	const handleSearch = () => {
		if (searchTerm.trim()) {
			setLoading(true);
			onItemSelected(null);
			setSearchError('');
			studyApi
				.post<{ query: string }, Movie[]>('movies/search', {
					query: searchTerm.trim(),
				})
				.then((response) => {
					if (response) {
						setSuggestions(response);
						console.log("Search results: ", response);
					}
					setSuggestions(response);
					setLoading(false);
				})
				.catch((error) => {
					console.error('Error fetching movie suggestions:', error);
					setSearchError('Failed to fetch suggestions.');
					setLoading(false);
				});
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	const handleSelectSuggestion = (movie: Movie) => {
		setSearchTerm(movie.title);
		setSuggestions([]); // Hide suggestions after selection
		onItemSelected(movie);
	};

	return (
		<>
			<InputGroup className="mb-3">
				<Form.Label>{parse(formLabel)}</Form.Label>
				<FormControl
					placeholder={placeholder || 'Search for a movie...'}
					aria-label="Search movie"
					aria-describedby="basic-addon"
					value={searchTerm}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				/>
				<Button variant="primary" onClick={handleSearch} disabled={loading}>
					{loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <Search />}
				</Button>
			</InputGroup>

			{loading && <Alert variant="info">Searching...</Alert>}

			{searchError && <Alert variant="danger">{searchError}</Alert>}

			{suggestions.length > 0 && (
				<ul className="list-group mt-2">
					{suggestions.map((movie) => (
						<li
							key={movie.id}
							className="movie-search-suggestions list-group-item d-flex align-items-center"
							onClick={() => handleSelectSuggestion(movie)}
						>
							<Image src={movie.poster} width={72}/>
							<p>{movie.title} <span>({movie.year})</span></p>
						</li>
					))}
				</ul>
			)}
		</>
	);
};

export default SearchMovieFormControl
