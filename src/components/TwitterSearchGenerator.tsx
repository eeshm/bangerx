
'use client'
import React, { useState, useEffect } from 'react';
import { Search, Twitter, Copy, ExternalLink, User, Hash, AlertCircle, TrendingUp, History, ChevronDown, ChevronUp, Trash2, Clock, Info, ArrowLeft, Sparkles, Zap, Flame} from 'lucide-react';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { cn } from '@/lib/utils';
import StyledSlider from './Slider';
import { BlurFade } from './ui/blur-fade';
import Link from 'next/link';


const TwitterSearchGenerator = () => {
  const [currentStep, setCurrentStep] = useState('selection');
  const [searchMode, setSearchMode] = useState('');
  const [username, setUsername] = useState('');
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
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<any>>([]);
  const [feedback, setFeedback] = useState<{ type?: string; message?: string }>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const popularTopics = ['ai tools', 'meme', 'crypto','sora','productivity', 'startup', 'SaaS', 'modi vs rahul'];
  const popularCreators = ['elonmusk', 'naval', 'kirat_tw', 'levelsio', 'sama', 'mannupaaji', 'dannypostmaa', 'eeshmidha1', 'swyx', 'paulg'];

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
      const errors = validateFormInputs();
      setValidationErrors(errors);

      if (isValidInput() && Object.keys(errors).length === 0) {
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
  }, [currentStep, searchMode, username, keyword, topicKeywords, minLikes, minRetweets, minReplies, excludeRetweets, mediaOnly]);

  const selectSearchMode = (mode: any) => {
    setSearchMode(mode);
    setCurrentStep('form');
    setUsername('');
    setKeyword('');
    setTopicKeywords('');
    setGeneratedUrl('');
    setSummary('');
    setQueryPreview('');
    setFeedback({});
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
    setFeedback({});
    setValidationErrors({});
  };

  const validateFormInputs = () => {
    const errors: Record<string, string> = {};

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

    return errors;
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
      setFeedback({});
    }
  };

  const applyPreset = (preset: any) => {
    switch (preset) {
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

  const fillExample = (example: any, type: any) => {
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

    const newHistory: any = [searchItem, ...searchHistory.slice(0, 9)];
    setSearchHistory(newHistory);
    localStorage.setItem('bangerSearchHistory', JSON.stringify(newHistory));
  };

  const loadFromHistory = (item: any) => {
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

  const deleteHistoryItem = (id: any) => {
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

  const formatHistoryItem = (item: any) => {
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

  const presets = [
    { id: 'low', label: 'Low Viral' },
    { id: 'medium', label: 'High Viral' },
    { id: 'mega', label: 'Mega Viral' },
  ];

const link = "https://banger-x.vercel.app";

const tweetText = `Discovering the best viral content thanks to BangerX. Check it out: ${link} #ContentDiscovery #bangerx`;

const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <div className="min-h-screen pt-12 px-5 tracking-tight font-mono text-xs">
      <div className="selection:bg-black selection:text-white dark:selection:bg-theme-dark-subtext dark:selection:text-theme-dark
       flex flex-col min-h-[calc(100vh-6rem)] justify-between">
        <div className="flex-1 overflow-y-auto">
          <div className="text-center mb-12">
            <BlurFade delay={0.10}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-wider underline underline-offset-8  decoration-[var(--color-orange)]   dark:text-theme-dark-text">
                  BangerX
                </h1>
              </div>
            </BlurFade>
            <BlurFade delay={0.10 * 2}>
              <p className="text-sm text-gray-600 dark:text-theme-dark-subtext  max-w-lg mx-auto">
                A cheat code for X's native search. Find what's actually popping off, no API, no BS.
              </p>
            </BlurFade>
          </div>
          <div className="">
            {currentStep === 'selection' ? (
              <div className="bg-brand-bg min-h-screen flex justify-center p-4 sm:p-6 lg:p-8 scroll-smooth">
                <div className="max-w-4xl w-full mx-auto text-center">

                  <BlurFade delay={0.10 * 3}>
                    <h2 className="text-2xl sm:text-3xl  tracking-tighter font-bold text-gray-800 dark:text-theme-dark-text mb-4">
                      How we huntin' today?
                    </h2>
                  </BlurFade>
                  <BlurFade delay={0.10 * 4}>
                    <p className="text-gray-500 mb-12 max-w-xl mx-auto dark:text-theme-dark-subtext">
                      Two paths to find the fire. Pick one.
                    </p>
                  </BlurFade>

                  {/* Grid layout for responsive cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <BlurFade delay={0.10 * 5}>
                      <div className='p-1 border-2 dark:[box-shadow:3px_3px_40px_5px_#c6c6c635_inset]   [box-shadow:3px_3px_40px_5px_#c6c6c635] rounded-md'>
                      <button
                        onClick={() => selectSearchMode('creator')}
                        className="flex w-full h-full  sm:h-50 md:h-70 bg-card-bg border-none dark:border-theme-dark-card dark:bg-theme-dark-card/95 flex-col p-8  border-[0.1px]  rounded-sm text-left transition-all duration-300 ease-in-out hover:shadow-lg hover:border-brand-primary dark:hover:shadow-theme-dark-card hover:-translate-y-1 group flex-grow"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          {/* <UserIcon className="h-7 w-7 text-gray-400 group-hover:text-brand-primary transition-colors" /> */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-theme-dark-text">Find from Username</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6 dark:text-theme-dark-subtext">
                          Find out what makes top accounts tick. We'll pull up their most legendary posts.
                        </p>
                        <div className="mt-auto  text-gray-500 dark:text-theme-dark-subtext">
                          @elonmusk, @naval, @kirat_tw, @mannupaaji →
                        </div>
                      </button>
                      </div>
                    </BlurFade>

                    {/* Card 2 */}
                    <BlurFade delay={0.10 * 5}>
                      <div className='p-1 border-2 dark:[box-shadow:3px_3px_40px_5px_#c6c6c635_inset] rounded-md'>
                      <button
                        onClick={() => selectSearchMode('topic')}
                        className="flex flex-col w-full h-full sm:h-50 bg-card-bg  border-none dark:border-theme-dark-card dark:bg-theme-dark-card/95  md:h-70 p-8  border-[0.1px]  rounded-sm text-left transition-all duration-300 ease-in-out dark:hover:shadow-theme-dark-card hover:shadow-lg hover:border-brand-primary hover:-translate-y-1 group flex-grow"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          {/* <MagnifyingGlassIcon className="h-7 w-7 text-gray-400 group-hover:text-brand-primary transition-colors" /> */}
                          <h3 className="text-xl font-bold text-gray-900 dark:text-theme-dark-text">Find by Keyword/Topic</h3>
                        </div>
                        <p className="text-gray-600 dark:text-theme-dark-subtext leading-relaxed mb-6">
                          Drop a keyword, find the sauce. See what's actually hitting in any niche.
                        </p>
                        <div className="mt-auto  text-gray-500 dark:text-theme-dark-subtext font-mono">
                          "ai tools", "meme", "sora 2 codes" →
                        </div>
                      </button>
                      </div>
                    </BlurFade>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={goBackToSelection}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-theme-dark-text mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to search options
                </button>

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {/* {searchMode === 'topic' ? (
                      <Hash className="w-6 h-6 text-purple-600" />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )} */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-theme-dark-text underline underline-offset-5 decoration-[#f54e00] decoration-wavy">
                      {searchMode === 'topic' ? 'Find by Keyword/Topic' : 'Find from Username'}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-theme-dark-subtext">
                    {searchMode === 'topic'
                      ? 'Uncover the top posts in any niche.'
                      : 'Pull the greatest hits from any account.'
                    }
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {searchMode === 'creator' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700  dark:text-theme-dark-text mb-2">
                          Creator Username
                        </label>
                        <PlaceholdersAndVanishInput
                          value={username}
                          setValue={setUsername}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholders={popularCreators}
                        />
                        {validationErrors.username && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {validationErrors.username}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500 flex mt-1">Try:</span>
                          {popularCreators.slice(0, 4).map(creator => (
                            <button
                              key={creator}
                              onClick={() => fillExample(creator, 'creator')}
                              className="text-xs px-1 py-1 hover:bg-[var(--color-card-bg)] dark:hover:bg-theme-dark-card cursor-pointer rounded transition-colors"
                            >
                              @{creator}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-theme-dark-text mb-2">
                          + Keyword Filter <span className="text-gray-500 font-normal dark:text-theme-dark-text">(optional)</span>
                        </label>
                        <PlaceholdersAndVanishInput
                          value={keyword}
                          setValue={setKeyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholders={["AI, startups, productivity..."]}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700  dark:text-theme-dark-text mb-2">
                        Topic or Keywords
                      </label>
                      <PlaceholdersAndVanishInput
                        value={topicKeywords}
                        setValue={setTopicKeywords}
                        onChange={(e) => setTopicKeywords(e.target.value)}
                        placeholders={popularTopics}
                      />
                      {validationErrors.topic && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {validationErrors.topic}
                        </p>
                      )}
                      <p className="text-xs text-shadow-2xs shadow-amber-200 text-gray-500 mt-1">
                        Use quotes for exact phrases, OR for alternatives
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs relative top-1 text-gray-500">Popular:</span>
                        {popularTopics.slice(0, 4).map(topic => (
                          <button
                            key={topic}
                            onClick={() => fillExample(topic, 'topic')}
                            className={cn("text-xs px-1 py-1 hover:bg-[var(--color-card-bg)] dark:hover:bg-theme-dark-card  dark:text-theme-dark-text text-black rounded",
                              " transition-colors cursor-pointer"
                            )}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className=" rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-theme-dark-text">Set the Viral Bar</h3>
                    <div className="flex gap-2">
                      {presets.map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => applyPreset(id)}
                          className={cn("px-2  py-1 text-[9px] rounded-sm flex items-center ",
                            "transition-all",
                            "hover:text-orange bg-[var(--color-card-bg)] dark:bg-theme-dark-card",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray- dark:text-theme-dark-text mb-2">
                        <span>Min Likes</span>
                        <span className="font-medium">{minLikes}</span>
                      </div>
                      <StyledSlider
                        value={minLikes}
                        onChange={(e: any) => setMinLikes(parseInt(e.target.value))}
                        min={0}
                        max={10000}
                        step={50}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-700 dark:text-theme-dark-text mb-2">
                        <span>Min Retweets</span>
                        <span className="font-medium">{minRetweets}</span>
                      </div>
                      <StyledSlider
                        value={minRetweets}
                        onChange={(e: any) => setMinRetweets(parseInt(e.target.value))}
                        min={0}
                        max={1000}
                        step={10}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-700 dark:text-theme-dark-text mb-2">
                        <span>Min Replies</span>
                        <span className="font-medium">{minReplies}</span>
                      </div>
                      <StyledSlider
                        value={minReplies}
                        onChange={(e) => setMinReplies(parseInt(e.target.value))}
                        min={0}
                        max={500}
                        step={5}
                      />
                    </div>
                  </div>

                  {validationErrors.engagement && (
                    <p className="mt-3 text-sm text-orange flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.engagement}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                    <label className="flex transition items-center gap-2">
                      <input
                        type="checkbox"
                        checked={mediaOnly}
                        onChange={(e) => setMediaOnly(e.target.checked)}
                        className={cn("w-4 h-4 rounded",
                          "accent-[var(--color-theme-fg)] dark:accent-[var(--color-theme-dark-subtext)]"
                        )}
                      />
                      <span className="text-sm text-gray-700 dark:text-theme-dark-subtext">Media only (images/videos)</span>
                    </label>
                    <label className="flex items-center transition  gap-2">
                      <input
                        type="checkbox"
                        checked={excludeRetweets}
                        onChange={(e) => setExcludeRetweets(e.target.checked)}
                        className={cn("w-4 h-4 rounded",
                          "accent-theme-dark dark:accent-theme-bg"
                        )}
                      />
                      <span className="text-sm text-gray-700 dark:text-theme-dark-subtext">Exclude retweets</span>
                    </label>
                  </div>
                </div>

                {queryPreview && (
                  <div className="bg-[var(--color-card-bg)] dark:bg-theme-dark-card rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center dark:text-theme-dark-subtext text-sm">
                      <Search className="w-4 h-4 mr-2 stroke-[var(--color-orange)]" />
                      Your X Search Query
                    </h4>
                    <code className="text-xs text-gray-800  dark:text-theme-dark-subtext block bg-[var(--color-theme-bg)]  dark:bg-theme-dark p-2 rounded break-all">
                      {queryPreview}
                    </code>
                  </div>
                )}

                {/* {feedback && (
                <div className={`border rounded-lg p-3 mb-6 flex items-center gap-2 text-sm ${
                  feedback.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  feedback.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <Info className="w-4 h-4 flex-shrink-0" />
                  {feedback.message}
                </div>
              )}
               */}
                {generatedUrl && (
                  <div className=" rounded-lg">
                    <h3 className="font-semibold dark:text-theme-dark-text text-h1 mb-4 inline-flex items-center">
                      Search URL Generated
                    </h3>

                    <div className="bg-[var(--color-card-bg)] dark:bg-theme-dark-card p-3 rounded-lg border mb-4 overflow-x-auto">
                      <code className="text-xs text-gray-700 break-all  dark:text-theme-dark-subtext">
                        {generatedUrl}
                      </code>
                    </div>

                    <div className="flex gap-3 w-full">
                      <button
                        onClick={openInNewTab}
                        className={cn("flex-1 bg-theme-fg dark:bg-theme-dark-card [box-shadow:3px_3px_40px_5px_#c6c6c635_inset]  hover:shadow-none text-white font-medium",
                          "py-3 px-4 rounded-lg",
                          "transition-colors flex items-center justify-center gap-2",
                          "hover:bg-gray-950 ",
                          "transition-all duration-150 ")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in X
                      </button>

                      {/* <div className=''> */}
                      <button
                        onClick={copyToClipboard}
                        className={cn(`justify-center rounded-lg border-2 gap-2 ${copied
                          ? 'bg-[var(--color-orange)] text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`,
                          "font-medium text-sm transition-colors flex items-center",
                          "w-[calc(100%-80%)] text-center",
                          "transition-all duration-150 hover:scale-[0.98] cursor-pointer",
                          "md:flex hidden"
                        )}
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      {/* </div> */}
                    </div>

                    <div className="mt-4 p-3  rounded-lg">
                      <p className="text-xs flex items-center gap-1 dark:text-theme-dark-subtext">
                        <span>Not enough hits? Try lowering the engagement bar or use a preset like "Low Viral".
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        <div className="rounded-lg shadow-md mt-5">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-6 py-4 flex items-center justify-between text-left  hover:bg-gray-50  dark:hover:bg-theme-dark-card shadow rounded transition-colors text-"
          >
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600 dark:text-theme-dark-text" />
              <span className="font-medium text-gray-900 dark:text-theme-dark-text">
                Search History ({searchHistory.length})
              </span>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showHistory && (
            <div className="border-t px-6 pb-4">
              {searchHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  go search first !!!
                </p>
              ) : (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Recent searches</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>

                  {searchHistory.slice(0, 5).map((item: any) => {
                    const formatted = formatHistoryItem(item);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--color-card-bg)]  dark:bg-theme-dark-card rounded-lg text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 dark:text-theme-dark-text truncate">
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
                            className="text-gray-600 hover:text-gray-700  text-xs cursor-pointer hover:underline flex items-center bg gap-1 px-2 py-1"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => window.open(item.url, '_blank')}
                            className="text-gray-600 hover:text-gray-700 text-xs cursor-pointer hover:underline flex items-center gap-1 px-2 py-1"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-gray-600 hover:text-gray-700 text-xs cursor-pointer hover:underline"
                          >
                            Delete
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

        <div className="text-center my-8 text-gray-600  space-y-1 dark:text-theme-dark-text">
          <p className="text">
            Your cheat code for viral content. No limits.
          </p>
          <div className='flex flex-col space-y-1'>
          {/* <Link href={"https://x.com/eeshmidha1"} target='_blank' className='underline underline-offset-2 '>
          created by eesh
          </Link> */}
          {/* <Link href={tweetUrl} className='underline text-[10px]'>
          share on x <ExternalLink className='inline-flex size-2'/>
          </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterSearchGenerator;