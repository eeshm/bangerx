import { isValid, min, set } from 'date-fns';
import React, { useState, useEffect } from 'react';

const TwitterSearchGenerator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState('selection'); // 'selection' or 'form'
    const [searchMode, setSearchMode] = useState(''); //'creator' or 'topic'
    const [username, setUsername] = useState('');
    const [keyword, setKeyword] = useState('');
    const [topicKeywords, setTopicKeywords] = useState('');
    const [minLikes, setMinLikes] = useState<number | undefined>(100);
    const [minRetweets, setMinRetweets] = useState<number | undefined>(10);
    const [minReplies, setMinReplies] = useState<number | undefined>(5);
    const [excludeRetweets, setExcludeRetweets] = useState(false);
    const [mediaOnly, setMediaOnly] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [searchSummary, setSearchSummary] = useState('');
    const [copied, setCopied] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState({});


    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            try {
                setSearchHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse search history from localStorage:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (currentStep == 'form' && isValidInput()) {
            generateSearchUrl();
            generateSearchSummary();
            generateFeedbackMessage();
        } else {
            setGeneratedUrl('');
            setSearchSummary('');
            setFeedbackMessage('');

        }
    }, [currentStep, searchMode, username, keyword, topicKeywords, minLikes, minRetweets, minReplies, excludeRetweets, mediaOnly]);

    const selectSearchMode = (mode: string) => {
        setSearchMode(mode);
        setCurrentStep('form');
        setUsername('');
        setKeyword('');
        setTopicKeywords('');
        setMinLikes(undefined);
        setMinRetweets(undefined);
        setMinReplies(undefined);
        setExcludeRetweets(false);
        setMediaOnly(false);
        setGeneratedUrl('');
        setSearchSummary('');
        setFeedbackMessage('');
    };

    const goBackToSelection = () => {
        setCurrentStep('selection');
        setSearchMode('');
        setGeneratedUrl('');
        setSearchSummary('');
        setFeedbackMessage('');
    };

    const isValidInput = () => {
        if (searchMode === 'creator') {
            return username.trim().length > 0
        } else if (searchMode === 'topic') {
            return topicKeywords.trim().length > 0
        } else {
            return false;
        }
    }

    const generateSearchUrl = () => {
        let query = '';
        if (searchMode === 'creator') {
            const cleanUsername = username.replace('@', '').trim();
            query = 'from:' + username;
            if (keyword.trim().length > 0) {
                query += ` ${keyword.trim()}`;
            }
        } else {
            query = topicKeywords.trim()
            // const keywords = topicKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        }

        if (minLikes && minLikes > 0) {
            query += ` min_faves:${minLikes}`;
        }
        if (minReplies && minReplies > 0) {
            query += ` min_replies:${minReplies}`;
        }
        if (minRetweets && minRetweets > 0) {
            query += ` min_retweets:${minRetweets}`;
        }

        if (excludeRetweets) {
            query += `-filter:retweets ${query}`;
        }
        if (mediaOnly) {
            query += 'filter:media';
        }

        const encodedQuery = encodeURIComponent(query.trim());
        const url = `https://x.com/search?q=${encodedQuery}&fsrc=typed_query&f=top`;
        setGeneratedUrl(url);
    }

    const generateSearchSummary = () => {
        let summary = '';
        if (searchMode === 'creator') {
            const cleanUsername = username.replace('@', '').trim();
            summary = `find tweet from @${cleanUsername}`;
            if (keyword.trim().length > 0) {
                summary += ` that contains "${keyword.trim()}"`;
            }
        } else {
            summary = `find tweets about "${topicKeywords.trim()}"`;
        }

        const criteria = [];
        if (minLikes && minLikes > 0) {
            criteria.push(`${minLikes} likes`);
        }
        if (minReplies && minReplies > 0) {
            criteria.push(`${minReplies} replies`);
        }
        if (minRetweets && minRetweets > 0) {
            criteria.push(`${minRetweets} retweets`);
        }
        if (criteria.length > 0) {
            summary += ` with ${criteria.join(', ')}`;
        }

        //Add filters
        if (mediaOnly) {
            summary += ', media only';
        }
        if (excludeRetweets) {
            summary += ', no retweets';
        }
        setSearchSummary(summary);
    }


    const generateFeedbackMessage = () => {
        const totalThresholds = (minLikes || 0) + (minReplies || 0) + (minRetweets || 0);
        if (totalThresholds === 0) {
            setFeedbackMessage(
                {
                    type: 'warning',
                    message:
                    'Note: No minimum thresholds set. This may return a large number of results.'
        });

        } else if (totalThresholds < 20) {
            setFeedbackMessage(
                {
                    type: 'warning',
                    message:'Note: Low thresholds may return a large number of results.'
        });
        } else {
            setFeedbackMessage('');
        }
    }

    const saveToHistory = () => {
        if(!generatedUrl) return;
        const searchItem ={
            id:Date.now(),
            url:generatedUrl,
        }
    }
    return (
        <div>

        </div>
    )
}