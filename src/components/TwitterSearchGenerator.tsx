'use client';
import React, { useState, useEffect } from 'react';
// import { Search, Twitter, Copy, ExternalLink, Calendar, User, AlertCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, min } from 'date-fns';
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const TwitterSearchGenerator = () => {
  const [username, setUsername] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [copied, setCopied] = useState(false);

  const [showPriview, setShowPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [excludeReplies, setExcludeReplies] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(true)

    ;
  const [excludeRetweets, setExcludeRetweets] = useState(false);
  const [minReplies, setMinReplies] = useState<number | undefined>(undefined);
  const [minLikes, setMinLikes] = useState<number | undefined>(undefined);
  const [minRetweets, setMinRetweets] = useState<number | undefined>(undefined);

  const [searchHistory, setSearchHistory] = useState<any>([]);
  const [showHistory, setShowHistory] = useState(false);


  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('twitterSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history from localStorage', e);
      }
    }
  })

  useEffect(() => {
    if (username && fromDate && untilDate && validateInputs()) {
      generateSearchUrl();
    } else {
      setGeneratedUrl('');
    }
  }, [username, fromDate, untilDate, excludeReplies, excludeRetweets, includeMedia, minReplies, minLikes, minRetweets]);

  const validateInputs = () => {
    const newErrors: any = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else {
      const cleanUsername = username.replace('@', '').trim();
      if (!/^[A-Za-z0-9_]{1,15}$/.test(cleanUsername)) {
        newErrors.username = 'Invalid username format';
      }
    }

    // Date validation
    if (!fromDate) {
      newErrors.fromDate = 'Start date is required';
    }
    if (!untilDate) {
      newErrors.untilDate = 'End date is required';
    }

    if (fromDate && untilDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (fromDate >= untilDate) {
        newErrors.dateRange = 'Start date must be before end date';
      }
      if (untilDate > today) {
        newErrors.untilDate = 'End date cannot be in the future';
      }
      if (fromDate > today) {
        newErrors.fromDate = 'Start date cannot be in the future';
      }
      // Twitter's earliest tweets are from 2006
      if (fromDate < new Date('2006-03-21')) {
        newErrors.fromDate = 'So Sorry! But Twitter was born in March 2006';
      }
    }


    if (minReplies && (isNaN(minReplies) || minReplies < 0)) {
      newErrors.minReplies = 'Min replies must be a non-negative number';
    }
    if (minLikes && (isNaN(minLikes) || minLikes < 0)) {
      newErrors.minLikes = 'Min likes must be a non-negative number';
    }
    if (minRetweets && (isNaN(minRetweets) || minRetweets < 0)) {
      newErrors.minRetweets = 'Min retweets must be a non-negative number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSearchUrl = () => {
    if (!validateInputs()) return;

    const cleanUsername = username.replace('@', '').trim();
    const formattedFromDate = formatDate(fromDate);
    const formattedUntilDate = formatDate(untilDate);
    let query = `from:${cleanUsername} since:${formattedFromDate} until:${formattedUntilDate}`;

    if (excludeReplies) query += ' -filter:replies';
    if (excludeRetweets) query += ' -filter:retweets';
    if (includeMedia) query += ' filter:media';
    if (minReplies) query += ` min_replies:${minReplies}`;
    if (minLikes) query += ` min_faves:${minLikes}`;
    if (minRetweets) query += ` min_retweets:${minRetweets}`;

    const encodedQuery = encodeURIComponent(query);
    const url = `https://x.com/search?q=${encodedQuery}&src=typed_query&f=top`;

    setGeneratedUrl(url);
  };


  const saveToHistory = () => {
    if (!generatedUrl) return;
    const searchItem = {
      id: Date.now(),
      username: username.replace('@', '').trim(),
      fromDate,
      untilDate,
      url: generatedUrl,
      timestamp: new Date().toISOString(),
      filter: {
        excludeReplies,
        excludeRetweets,
        includeMedia,
        minReplies,
        minLikes,
        minRetweets

      }
    };
    const newHistory = [searchItem, ...searchHistory].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('twitterSearchHistory', JSON.stringify(newHistory));
  }

  const loadFromHistory = (item: any) => {
    setUsername(item.username);
    setFromDate(new Date(item.fromDate));
    setUntilDate(new Date(item.untilDate));
    setExcludeReplies(item.filter.excludeReplies);
    setExcludeRetweets(item.filter.excludeRetweets);
    setIncludeMedia(item.filter.includeMedia);
    setMinReplies(item.filter.minReplies);
    setMinLikes(item.filter.minLikes);
    setMinRetweets(item.filter.minRetweets);
    setGeneratedUrl(item.url);
    setShowHistory(false);
  }

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('twitterSearchHistory');
  }
  const deleteHistoryItem = (id: number) => {
    const newHistory = searchHistory.filter((item: any) => item.id !== id);
    setSearchHistory(newHistory);
    localStorage.setItem('twitterSearchHistory', JSON.stringify(newHistory));
  }


  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      const newErrors = { ...errors };
      delete newErrors.username;
      setErrors(newErrors);
    }
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
    window.open(generatedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-black">
              X Search Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Generate search URLs for X to find tweets from specific users within date ranges
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl border  border-gray-300 p-8">
          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                {/* <User className="w-4 h-4 inline mr-2" /> */}
                X Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="elonmusk or @elonmusk"
                  className={`flex h-9 w-full rounded-md border bg-transparent px-3 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 py-5 ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                />
                {username && (
                  <span className="absolute right-3 top-3 text-gray-400 text-sm">
                    @{username.replace('@', '')}
                  </span>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  {/* <AlertCircle className="w-4 h-4 mr-1" /> */}
                  {errors.username}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${errors.fromDate ? 'border-red-300 bg-red-50' : ''
                        }`}
                    >
                      {fromDate ? format(fromDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <DayPicker
                      captionLayout='dropdown'
                      navLayout='around'
                      startMonth={new Date(2006, 10)}
                      endMonth={new Date(2025, 11)}
                      selected={fromDate}
                      onSelect={setFromDate}
                      disabled={[
                        { before: new Date('2006-03-21') },
                        { after: new Date() }
                      ]}
                    />
                  </PopoverContent>
                </Popover>
                {errors.fromDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.fromDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Until Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${errors.untilDate ? 'border-red-300 bg-red-50' : ''
                        }`}
                    >
                      {untilDate ? format(untilDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <DayPicker
                      captionLayout='dropdown'
                      navLayout='around'
                      startMonth={new Date(2006, 10)}
                      endMonth={new Date(2025, 11)}
                      selected={untilDate}
                      onSelect={setUntilDate}
                      disabled={[
                        { before: fromDate || new Date('2006-03-21') },
                        { after: new Date() }
                      ]}
                    />
                  </PopoverContent>
                </Popover>
                {errors.untilDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    {errors.untilDate}
                  </p>
                )}
              </div>
            </div>

            {errors.dateRange && (
              <p className="text-sm text-red-600 flex items-center">
                {/* <AlertCircle className="w-4 h-4 mr-1" /> */}
                {errors.dateRange}
              </p>
            )}
          </div>


          {/* Advanced options toggle */}
          <div className='border-t pt-6'>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className='flex item-center gap-2 text-blue-600 hover:text-blue-400 font-medium transition-colors'>
              Advanced Options
              {showAdvanced ? '▲' : '▼'}
            </button>              
            {showAdvanced && (
              <div className='mt-4 p-4 bg-gray-100 rounded-lg space-y-4'>
                {/* Filter options */}
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-3'>
                    <h4 className='font-semibold text-gray-700'>Filters</h4>
                    <label className='flex items-center'>
                      <input
                      type='checkbox'
                      checked={excludeReplies}
                      onChange={(e) => setExcludeReplies(e.target.checked)}
                      className='w-4 h-4 text-blue-300 gap-2'/>
                      <span className='ml-2 text-sm text-gray-700'>Exclude Replies</span>
                      </label>
                    <label className='flex items-center'>
                      <input
                      type='checkbox'
                      checked={excludeRetweets}
                      onChange={(e) => setExcludeRetweets(e.target.checked)}
                      className='w-4 h-4 text-blue-300 gap-2'/>
                      <span className='ml-2 text-sm text-gray-700'>Exclude Replies</span>
                      </label>
                    <label className='flex items-center'>
                      <input
                      type='checkbox'
                      checked={includeMedia}
                      onChange={(e) => setIncludeMedia(e.target.checked)}
                      className='w-4 h-4 text-blue-300 gap-2'/>
                      <span className='ml-2 text-sm text-gray-700'>Include Media Only</span>
                      </label>
                  </div>
                  <div>
                    <label className='font-semibold text-gray-700'>Minimums</label>
                    <input 
                    type="number"
                    min={0}
                    value={minReplies || ''}
                    onChange={(e) => setMinReplies(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder='Min Replies'
                    className={`w-full mt-2 px-3 py-2 border rounded-md ${errors.minReplies ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    />
                    {errors.minReplies && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        {errors.minReplies}
                      </p>
                    )}
                    <input 
                    type="number"
                    min={0}
                    value={minLikes || ''}
                    onChange={(e)=>setMinLikes(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder='Min Likes'
                    className={`w-full mt-2 px-3 py-2 border rounded-md ${errors.minLikes ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    />
                    {errors.minLikes && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        {errors.minLikes}
                      </p>
                    )}
                    <input
                    type="number"
                    min={0}
                    value={minRetweets || ''}
                    onChange={(e)=>setMinRetweets(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder='Min Retweets'
                    className={`w-full mt-2 px-3 py-2 border rounded-md ${errors.minRetweets ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    />
                    {errors.minRetweets && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        {errors.minRetweets}
                      </p>
                    )}
                    </div>
                </div>
              </div>
            )}
          </div>
          </div>         
          </div>
          {/* Generated URL Section */}
          {generatedUrl && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                {/* <Search className="w-5 h-5 mr-2" /> */}
                Generated Search URL
              </h3>

              <div className="bg-white p-4 rounded-lg border mb-4">
                <code className="text-sm text-gray-800 break-all">
                  {generatedUrl}
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={openInNewTab}
                  className="flex-1 bg-black hover:bg-gray-900 hover:scale-[0.98] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {/* <ExternalLink className="w-4 h-4" /> */}
                  Open in X
                </button>

                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-3  text-white text-center hover:scale-[0.98] rounded-lg w-[calc(100%-80%)] border-2 font-medium transition-colors flex items-center justify-center gap-2 ${copied
                    ? 'bg-green-400 border-green-200 text-green-700'
                    : 'bg-black border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white cursor-pointer'
                    }`}
                >
                  {/* <Copy className="w-4 h-4" /> */}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <div className='lg-col-span-2 mt-8 flex justify-between items-center'>
            <div className='bg-white rounded-2xl shadow-xl p-6'>
              <div className='flex items-center gap-3'>
                <h3 className='text-lg font-semibold text-gray-900'>Search History</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className='text-blue-600 hover:text-blue-400 font-medium transition-colors'

                >
                  {showHistory ? '▲' : '▼'}
                </button>
              </div>
              {showHistory && (
                <div className='mt-4 space-y-4 max-h-64 overflow-y-auto'>
                  {searchHistory.length === 0 && (
                    <p className='text-sm text-gray-600'>No search history yet.</p>
                  )}
                  {searchHistory.map((item: any) => (
                    <div key={item.id} className='border p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='text-sm text-gray-800 break-all'>{item.url}</p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {item.username} • {format(new Date(item.fromDate), 'PPP')} to {format(new Date(item.untilDate), 'PPP')}
                          </p>
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                          <button

                            onClick={() => loadFromHistory(item)}
                            className='text-blue-600 hover:text-blue-400 text-sm font-medium transition-colors'
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className='text-red-600 hover:text-red-400 text-sm font-medium transition-colors'
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className='mt-2 text-red-600 hover:text-red-400 text-sm font-medium transition-colors'
                    >
                      Clear History
                    </button>
                  )}
                </div>
              )}


            </div>
            </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Searches exclude replies by default`` for cleaner results</li>
              <li>• Results are sorted by "Top" to show most relevant tweets first</li>
              <li>• X's search typically goes back ~7 days for free accounts</li>
              <li>• Premium X accounts may access extended historical data</li>
            </ul>
          </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Built with Next.js • Generate search URLs without API keys or authentication
          </p>
        </div>
    </div>
  );
};
import { DayProps } from 'react-day-picker';

export default TwitterSearchGenerator;