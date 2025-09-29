
'use client'
import React, { useState, useEffect } from 'react';
import { Search, Twitter, Copy, ExternalLink, User, Hash, AlertCircle, TrendingUp, History, ChevronDown, ChevronUp, Trash2, Clock, Info, ArrowLeft, Sparkles, Zap, Flame } from 'lucide-react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';

const TwitterSearchGenerator = () => {
  const [currentStep, setCurrentStep] = useState('selection');
  const [searchMode, setSearchMode] = useState('');
  const [username, setUsername] = useState<any>('');
  const [keyword, setKeyword] = useState('');
  const [topicKeywords, setTopicKeywords] = useState('');
  const [minLikes, setMinLikes] = useState(100);
  const [minRetweets, setMinRetweets] = useState(10);
  const [minReplies, setMinReplies] = useState(5);
  const [excludeRetweets, setExcludeRetweets] = useState(false);
  const [mediaOnly, setMediaOnly] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [searchSummary, setSummary] = useState('');
  const [queryPreview, setQueryPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState<any>(false);
  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [feedback, setFeedback] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<any>({});

  const popularTopics = ['AI tools', 'productivity', 'crypto', 'startup advice', 'fitness tips', 'SaaS', 'indie hacking'];
  const popularCreators = ['elonmusk', 'naval', 'pmarca', 'levelsio', 'sama', 'dannypostmaa', 'swyx'];

  useEffect(() => {
    const savedHistory = localStorage.getItem('bangerSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentStep === 'form') {
      validateInputs();
      if (isValidInput() && Object.keys(validationErrors).length === 0) {
        generateSearchUrl();
        generateSummary();
        generateQueryPreview();
        generateFeedback();
      } else {
        setGeneratedUrl('');
        setSummary('');
        setQueryPreview('');
      }
    }
  }, [currentStep, searchMode, username, keyword, topicKeywords, minLikes, minRetweets, minReplies, excludeRetweets, mediaOnly, validationErrors]);

  const selectSearchMode = (mode:any) => {
    setSearchMode(mode);
    setCurrentStep('form');
    setUsername('');
    setKeyword('');
    setTopicKeywords('');
    setGeneratedUrl('');
    setSummary('');
    setQueryPreview('');
    setFeedback('');
    setValidationErrors({});
    
    // Set smart defaults based on mode
    if (mode === 'creator') {
      setMinLikes(500);
      setMinRetweets(50);
      setMinReplies(10);
    } else {
      setMinLikes(100);
      setMinRetweets(10);
      setMinReplies(5);
    }
  };

  const goBackToSelection = () => {
    setCurrentStep('selection');
    setSearchMode('');
    setGeneratedUrl('');
    setSummary('');
    setQueryPreview('');
    setFeedback('');
    setValidationErrors({});
  };

  const validateInputs = () => {
    const errors:any = {};

    if (searchMode === 'creator' && username.trim()) {
      const cleanUsername = username.replace('@', '').trim();
      if (!/^[A-Za-z0-9_]{1,15}$/.test(cleanUsername)) {
        errors.username = 'Invalid username format (letters, numbers, underscore only, max 15 chars)';
      }
    }

    if (searchMode === 'topic' && topicKeywords.trim() && topicKeywords.trim().length < 2) {
      errors.topic = 'Search term too short - try at least 2 characters';
    }

    // Sanity checks for engagement
    if (minReplies > minLikes && minReplies > 0 && minLikes > 0) {
      errors.engagement = 'Replies typically can\'t exceed likes - consider adjusting thresholds';
    }

    if (minRetweets > minLikes && minRetweets > 0 && minLikes > 0) {
      errors.engagement = 'Retweets typically can\'t exceed likes - consider adjusting thresholds';
    }

    setValidationErrors(errors);
  };

  const isValidInput = () => {
    if (searchMode === 'creator') {
      return username.trim().length > 0;
    } else {
      return topicKeywords.trim().length > 0;
    }
  };

  const generateSearchUrl = () => {
    let query = '';
    
    if (searchMode === 'creator') {
      const cleanUsername = username.replace('@', '').trim();
      query = `from:${cleanUsername}`;
      if (keyword.trim()) {
        query += ` ${keyword.trim()}`;
      }
    } else {
      query = topicKeywords.trim();
    }
    
    if (minLikes > 0) query += ` min_faves:${minLikes}`;
    if (minRetweets > 0) query += ` min_retweets:${minRetweets}`;
    if (minReplies > 0) query += ` min_replies:${minReplies}`;
    if (excludeRetweets) query += ' -filter:retweets';
    if (mediaOnly) query += ' filter:media';
    
    const encodedQuery = encodeURIComponent(query);
    const url = `https://x.com/search?q=${encodedQuery}&src=typed_query&f=top`;
    
    setGeneratedUrl(url);
  };

  const generateQueryPreview = () => {
    let query = '';
    
    if (searchMode === 'creator') {
      const cleanUsername = username.replace('@', '').trim();
      query = `from:${cleanUsername}`;
      if (keyword.trim()) {
        query += ` "${keyword.trim()}"`;
      }
    } else {
      query = topicKeywords.trim();
    }
    
    if (minLikes > 0) query += ` min_faves:${minLikes}`;
    if (minRetweets > 0) query += ` min_retweets:${minRetweets}`;
    if (minReplies > 0) query += ` min_replies:${minReplies}`;
    if (excludeRetweets) query += ' -filter:retweets';
    if (mediaOnly) query += ' filter:media';
    
    setQueryPreview(query);
  };

  const generateSummary = () => {
    let summary = '';
    
    if (searchMode === 'creator') {
      const cleanUsername = username.replace('@', '').trim();
      summary = `Find tweets from @${cleanUsername}`;
      if (keyword.trim()) {
        summary += ` about "${keyword.trim()}"`;
      }
    } else {
      summary = `Find viral tweets about "${topicKeywords.trim()}"`;
    }
    
    const criteria = [];
    if (minLikes > 0) criteria.push(`${minLikes}+ likes`);
    if (minRetweets > 0) criteria.push(`${minRetweets}+ retweets`);
    if (minReplies > 0) criteria.push(`${minReplies}+ replies`);
    
    if (criteria.length > 0) {
      summary += ` with ${criteria.join(', ')}`;
    }
    
    if (mediaOnly) summary += ', media only';
    if (excludeRetweets) summary += ', no retweets';
    
    setSummary(summary);
  };

  const generateFeedback = () => {
    const totalThreshold = minLikes + minRetweets + minReplies;
    
    if (totalThreshold > 1000) {
      setFeedback({
        type: 'warning',
        message: 'Very high thresholds - you might get few or no results. Try the "High Viral" preset first.'
      });
    } else if (totalThreshold > 500) {
      setFeedback({
        type: 'info', 
        message: 'Good thresholds for finding high-performing viral content'
      });
    } else if (totalThreshold < 50) {
      setFeedback({
        type: 'tip',
        message: 'Low thresholds might return many results. Consider using presets for more focused searches.'
      });
    } else {
      setFeedback('');
    }
  };

  const applyPreset  = (preset:any) => {
    switch(preset) {
      case 'low':
        setMinLikes(100);
        setMinRetweets(10);
        setMinReplies(5);
        break;
      case 'medium':
        setMinLikes(500);
        setMinRetweets(50);
        setMinReplies(20);
        break;
      case 'high':
        setMinLikes(1000);
        setMinRetweets(100);
        setMinReplies(50);
        break;
      case 'mega':
        setMinLikes(5000);
        setMinRetweets(500);
        setMinReplies(100);
        break;
    }
  };

  const fillExample = (example:any, type:any) => {
    if (type === 'topic') {
      setTopicKeywords(example);
    } else if (type === 'creator') {
      setUsername(example);
    }
  };

  const saveToHistory = () => {
    if (!generatedUrl) return;

    const searchItem = {
      id: Date.now(),
      mode: searchMode,
      username: searchMode === 'creator' ? username.replace('@', '') : '',
      keyword: searchMode === 'creator' ? keyword : topicKeywords,
      url: generatedUrl,
      summary: searchSummary,
      timestamp: new Date().toISOString(),
      filters: { minLikes, minRetweets, minReplies, excludeRetweets, mediaOnly }
    };

    const newHistory :any  = [searchItem, ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem('bangerSearchHistory', JSON.stringify(newHistory));
  };

  const loadFromHistory = (item:any) => {
    setSearchMode(item.mode);
    setCurrentStep('form');
    if (item.mode === 'creator') {
      setUsername(item.username);
      setKeyword(item.keyword);
    } else {
      setTopicKeywords(item.keyword);
    }
    setMinLikes(item.filters.minLikes);
    setMinRetweets(item.filters.minRetweets);
    setMinReplies(item.filters.minReplies);
    setExcludeRetweets(item.filters.excludeRetweets);
    setMediaOnly(item.filters.mediaOnly);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('bangerSearchHistory');
  };

  const deleteHistoryItem = (id:any) => {
    //@ts-ignore
    const newHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(newHistory);
    localStorage.setItem('bangerSearchHistory', JSON.stringify(newHistory));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openInNewTab = () => {
    saveToHistory();
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
  };

  const formatHistoryItem = (item:any) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const filters = [];
    if (item.filters.minLikes > 0) filters.push(`${item.filters.minLikes}+ likes`);
    if (item.filters.minRetweets > 0) filters.push(`${item.filters.minRetweets}+ RT`);
    if (item.filters.minReplies > 0) filters.push(`${item.filters.minReplies}+ replies`);
    if (item.filters.mediaOnly) filters.push('media');
    if (item.filters.excludeRetweets) filters.push('no RT');

    return {
      title: item.mode === 'creator' 
        ? `@${item.username}${item.keyword ? ` • ${item.keyword}` : ''}`
        : item.keyword,
      subtitle: filters.length > 0 ? filters.join(', ') : 'Default filters',
      date,
      type: item.mode
    };
  };

  return (
    <div className="min-h-screen bg-theme-lg py-12 px-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              X Banger's
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Generate powerful search URLs to find viral content on X. No API needed - leverages X's native search with smart filters.
          </p>
        </div>

        <div className="">
          {currentStep === 'selection' ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What type of bangers are you hunting?
              </h2>
              <div className="flex gap-6 max-w-lg mx-auto">
                <button
                  onClick={() => selectSearchMode('topic')}
                  className="group p-8  border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 bg-theme-fg">Find by Keyword/Topic</h3>
                  </div>
                </button>

                <button
                  onClick={() => selectSearchMode('creator')}
                  className="group p-8 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Find from Username</h3>
                  </div>
                  {/* <p className="text-gray-600 leading-relaxed">
                    Discover the most viral content from specific creators. Analyze what makes their tweets go viral and find their best-performing posts.
                  </p>
                  <div className="mt-4 text-sm text-blue-600 font-medium">
                    Example: @elonmusk, @naval, @pmarca →
                  </div> */}
                </button>
              </div>

              {searchHistory.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <p className="text-sm text-gray-600 mb-4">Or continue from recent searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchHistory.slice(0, 3).map((item:any


                    ) => {
                      const formatted = formatHistoryItem(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-2"
                        >
                          {item.mode === 'topic' ? <Hash className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {formatted.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={goBackToSelection}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to search options
              </button>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {searchMode === 'topic' ? (
                    <Hash className="w-6 h-6 text-purple-600" />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {searchMode === 'topic' ? 'Find by Keyword/Topic' : 'Find from Username'}
                  </h2>
                </div>
                <p className="text-gray-600">
                  {searchMode === 'topic' 
                    ? 'Search for viral tweets about any subject or trend'
                    : 'Discover viral content from specific creators'
                  }
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {searchMode === 'creator' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Creator Username
                      </label>
                      <PlaceholdersAndVanishInput
                        // type="text"
                        // value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholders={popularCreators}
                        // className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        //   validationErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        // }`}
                        // autoFocus
                      />
                      {validationErrors.username && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors.username}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">Popular:</span>
                        {popularCreators.map(creator => (
                          <button
                            key={creator}
                            onClick={() => fillExample(creator, 'creator')}
                            className="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                          >
                            @{creator}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        + Keyword Filter <span className="text-gray-500 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="AI, startups, productivity..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Topic or Keywords
                    </label>
                    <input
                      type="text"
                      value={topicKeywords}
                      onChange={(e) => setTopicKeywords(e.target.value)}
                      placeholder='"AI tools" OR productivity OR "life hacks"'
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        validationErrors.topic ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      autoFocus
                    />
                    {validationErrors.topic && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {validationErrors.topic}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Use quotes for exact phrases, OR for alternatives
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-500">Popular:</span>
                      {popularTopics.map(topic => (
                        <button
                          key={topic}
                          onClick={() => fillExample(topic, 'topic')}
                          className="text-xs px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Engagement Thresholds</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyPreset('low')}
                      className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Low Viral
                    </button>
                    <button
                      onClick={() => applyPreset('medium')}
                      className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      High Viral
                    </button>
                    <button
                      onClick={() => applyPreset('mega')}
                      className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors flex items-center gap-1"
                    >
                      <Flame className="w-3 h-3" />
                      Mega Viral
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>💙 Min Likes</span>
                      <span className="font-medium">{minLikes}</span>
                    </div>
                    <input
                      type="range"
                      value={minLikes}
                      onChange={(e) => setMinLikes(parseInt(e.target.value))}
                      min="0"
                      max="10000"
                      step="50"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>🔄 Min Retweets</span>
                      <span className="font-medium">{minRetweets}</span>
                    </div>
                    <input
                      type="range"
                      value={minRetweets}
                      onChange={(e) => setMinRetweets(parseInt(e.target.value))}
                      min="0"
                      max="1000"
                      step="10"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>💬 Min Replies</span>
                      <span className="font-medium">{minReplies}</span>
                    </div>
                    <input
                      type="range"
                      value={minReplies}
                      onChange={(e) => setMinReplies(parseInt(e.target.value))}
                      min="0"
                      max="500"
                      step="5"
                      className="w-full"
                    />
                  </div>
                </div>

                {validationErrors.engagement && (
                  <p className="mt-3 text-sm text-amber-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.engagement}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mediaOnly}
                      onChange={(e) => setMediaOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Media only (images/videos)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={excludeRetweets}
                      onChange={(e) => setExcludeRetweets(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Exclude retweets</span>
                  </label>
                </div>
              </div>

              {queryPreview && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center text-sm">
                    <Search className="w-4 h-4 mr-2" />
                    Your X Search Query
                  </h4>
                  <code className="text-xs text-indigo-800 block bg-white p-2 rounded break-all">
                    {queryPreview}
                  </code>
                </div>
              )}

              {searchSummary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Search Summary
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {searchSummary}
                  </p>
                </div>
              )}

              {feedback && (
                <div className={`border rounded-lg p-3 mb-6 flex items-center gap-2 text-sm ${
                  feedback.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  feedback.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <Info className="w-4 h-4 flex-shrink-0" />
                  {feedback.message}
                </div>
              )}

              <div className="text-center mb-6">
                <button
                  onClick={generateSearchUrl}
                  disabled={!isValidInput() || Object.keys(validationErrors).length > 0}
                  className={`px-8 py-4 rounded-lg font-semibold text-white transition-all flex items-center gap-2 mx-auto ${
                    isValidInput() && Object.keys(validationErrors).length === 0
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Generate Banger Search
                </button>
              </div>

              {generatedUrl && (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                    ✅ Search URL Generated
                  </h3>

                  <div className="bg-white p-3 rounded-lg border mb-4 overflow-x-auto">
                    <code className="text-xs text-gray-700 break-all">
                      {generatedUrl}
                    </code>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={openInNewTab}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in X
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors flex items-center gap-2 ${
                        copied 
                          ? 'bg-green-100 border-green-300 text-green-700' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-800 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      <span>
                        💡 <strong>Tip:</strong> If you see few results, try lowering your engagement thresholds or use the "Low Viral" preset.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Search History ({searchHistory.length})
              </span>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showHistory && (
            <div className="border-t px-6 pb-4">
              {searchHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No searches yet. Your history will appear here after you generate searches.
                </p>
              ) : (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Recent searches</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>
                  
                  {searchHistory.slice(0, 5).map((item:any) => {
                    const formatted = formatHistoryItem(item);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {item.mode === 'topic' ? (
                              <Hash className="w-3 h-3 text-purple-600" />
                            ) : (
                              <User className="w-3 h-3 text-blue-600" />
                            )}
                            <p className="font-medium text-gray-900 truncate">
                              {formatted.title}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatted.subtitle} • {formatted.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadFromHistory(item)}
                            className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1 px-2 py-1"
                          >
                            <Clock className="w-3 h-3" />
                            Load
                          </button>
                          <button
                            onClick={() => window.open(item.url, '_blank')}
                            className="text-gray-600 hover:text-gray-700 text-xs flex items-center gap-1 px-2 py-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Built with LOVE • Find viral content without API limits
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwitterSearchGenerator;