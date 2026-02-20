
'use client'
import React, { useState, useEffect } from 'react';
import { Search, Twitter, Copy, ExternalLink, User, Hash, AlertCircle, TrendingUp, History, ChevronDown, ChevronUp, Trash2, Clock, Info, ArrowLeft, Sparkles, Zap, Flame, Car, Sliders } from 'lucide-react';
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

  const popularTopics = ['ai tools', 'meme', 'crypto', 'sora', 'productivity', 'startup', 'SaaS', 'modi vs rahul'];
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
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'High' },
    { id: 'mega', label: 'Mega' },
  ];

  const link = "https://banger-x.vercel.app";

  const tweetText = `Discovering the best viral content thanks to BangerX. Check it out: ${link} #ContentDiscovery #bangerx`;

  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  return (
    <div className="min-h-screen pt-16 px-6 tracking-tight font-mono">
      <div className="selection:bg-black selection:text-white dark:selection:bg-theme-dark-subtext dark:selection:text-theme-dark
       flex flex-col min-h-[calc(100vh-6rem)] justify-between max-w-4xl mx-auto">
        <div className="flex-1 overflow-y-auto">
          <div className="text-center mb-8">
            <BlurFade delay={0.10}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight dark:text-theme-dark-text" style={{fontWeight: 600,fontSize:50 }}>
                  BangerX
                </h1>
              </div>
            </BlurFade>
            <BlurFade delay={0.10 * 2}>
              <p className="text-xs text-gray-600 dark:text-theme-dark-subtext  max-w-lg mx-auto">
                A cheat code for <span className=' underline underline-offset-5 decoration-[#f54e00] decoration-wavy'>X's</span> native search.
              </p>
            </BlurFade>
          </div>
          <div className="">
            {currentStep === 'selection' ? (
              <div className="bg-brand-bg flex justify-center p-4 sm:p-6 lg:p-8 scroll-smooth">
                <div className="max-w-4xl w-full mx-auto text-center">
                  <BlurFade delay={0.10 * 3}>
                    <h2 className="text-xl sm:text-2xl tracking-tighter font-bold text-gray-800 dark:text-theme-dark-text mb-4" style={{ fontWeight: 700 }}>
                      How we huntin' today?
                    </h2>
                  </BlurFade>


                  {/* Grid layout for responsive cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
                    {/* Card 1 */}
                    <BlurFade delay={0.10 * 4}>
                      <Card
                        title="Find from Username"
                        descriptiion="Find out what makes top accounts tick."
                        names="@elonmusk, @naval, @kirat_tw, @mannupaaji →"
                        handleClick={() => selectSearchMode('creator')} />

                    </BlurFade>

                    {/* Card 2 */}
                    <BlurFade delay={0.10 * 5}>
                      <Card
                        title="Find by Keyword/Topic"
                        descriptiion="Uncover the top posts in any niche."
                        names="ai tools, meme, crypto, productivity →"
                        handleClick={() => selectSearchMode('topic')}
                      />
                    </BlurFade>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={goBackToSelection}
                  className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 dark:text-theme-dark-text mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to search options
                </button>

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="font-bold text-gray-900 dark:text-theme-dark-text underline underline-offset-5 decoration-[#f54e00] decoration-wavy">
                      {searchMode === 'topic' ? 'Find by Keyword/Topic' : 'Find from Username'}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-theme-dark-subtext text-[10px]">
                    {searchMode === 'topic'
                      ? 'Uncover the top posts in any niche.'
                      : 'Pull the greatest hits from any account.'
                    }
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {searchMode === 'creator' ? (
                    <div className="space-y-4">
                      <SearchInput
                        label="Creator Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholders={popularCreators}
                        error={validationErrors.username}
                        examples={popularCreators.slice(0, 4).map(c => `@${c}`)}
                        onExampleClick={(example) => fillExample(example.replace('@', ''), 'creator')}
                      />
                      <SearchInput
                        label="+ Keyword Filter (optional)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholders={["AI, startups, productivity..."]}
                      />
                    </div>
                  ) : (
                    <SearchInput
                      label="Topic or Keywords"
                      value={topicKeywords}
                      onChange={(e) => setTopicKeywords(e.target.value)}
                      placeholders={popularTopics}
                      error={validationErrors.topic}
                      examples={popularTopics.slice(0, 4)}
                      onExampleClick={(example) => fillExample(example, 'topic')}
                      helpText="Use quotes for exact phrases, OR for alternatives"
                    />
                  )}
                </div>

                <div className="rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-theme-dark-text text-[10px]">Set the Viral Bar</h3>
                    <PresetButtons presets={presets} onPresetClick={applyPreset} />
                  </div>

                  <div className="space-y-4">
                    <MinimumBar title="Min Likes" value={minLikes} Slider={<StyledSlider
                        value={minLikes}
                        onChange={(e: any) => setMinLikes(parseInt(e.target.value))}
                        min={0}
                        max={10000}
                        step={50}
                      />}/>
                    <MinimumBar 
                    title="Min Retweets" 
                    value={minRetweets} 
                    Slider={<StyledSlider
                        value={minRetweets}
                        onChange={(e: any) => setMinRetweets(parseInt(e.target.value))}
                        min={0}
                        max={1000}
                        step={10}
                      />}
                    />
                    <MinimumBar 
                    title="Min Replies" 
                    value={minReplies} 
                    Slider={<StyledSlider
                        value={minReplies}
                        onChange={(e) => setMinReplies(parseInt(e.target.value))}
                        min={0}
                        max={500}
                        step={5}
                      />}
                    />
                  </div>
                  <FilterCheckboxes 
                    mediaOnly={mediaOnly} 
                    onMediaOnlyChange={setMediaOnly}
                    excludeRetweets={excludeRetweets}
                    onExcludeRetweetsChange={setExcludeRetweets}
                  />
                </div>

                {queryPreview && (
                  <QueryPreview query={queryPreview} />
                )}
                {generatedUrl && (
                  <GeneratedUrl url={generatedUrl} onOpen={openInNewTab} />
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
              <History className="size-3 text-gray-600 dark:text-theme-dark-text" />
              <span className="font-medium text-[10px] text-gray-900 dark:text-theme-dark-text">
                Search History ({searchHistory.length})
              </span>
            </div>
            {showHistory ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showHistory && (
            <div className="border-t px-6 pb-4">
              {searchHistory.length === 0 ? (
                <p className="text-[10px] text-gray-500 text-center py-8">
                  go search first !!!
                </p>
              ) : (
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Recent searches</span>
                    <button
                      onClick={clearHistory}
                      className="text-[10px] text-red-500 hover:text-red-700 dark:text-red-500 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>

                  {searchHistory.slice(0, 5).map((item: any) => {
                    const formatted = formatHistoryItem(item);
                    return (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        formatted={formatted}
                        onLoad={() => loadFromHistory(item)}
                        onOpen={() => window.open(item.url, '_blank')}
                        onDelete={() => deleteHistoryItem(item.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center my-8 text-gray-600  space-y-1 dark:text-theme-dark-text">
          <p className="text-[10px]">
            Your cheat code for viral content. No limits.
          </p>
          <div className='flex flex-col space-y-1'>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterSearchGenerator;




export const Card = ({ title, descriptiion, names, handleClick }: { title: string, descriptiion: string, names: string, handleClick: () => void }) => {
  return (
    <div className='p-1 border-2 dark:[box-shadow:3px_3px_40px_5px_#c6c6c635_inset] [box-shadow:3px_3px_40px_5px_#c6c6c635] rounded-md '>
      <button
        onClick={handleClick}
        className="flex w-full h-full  sm:h-50 md:h-50 bg-card-bg border-none dark:border-theme-dark-card dark:bg-theme-dark-card/95 flex-col p-8  border-[0.1px]  rounded-sm text-left transition-all duration-300 ease-in-out hover:shadow-lg hover:border-brand-primary dark:hover:shadow-theme-dark-card hover:-translate-y-1 group flex-grow"
      >
        <div className="flex items-center gap-4 mb-3">
          {/* <UserIcon className="h-7 w-7 text-gray-400 group-hover:text-brand-primary transition-colors" /> */}
          <h3 className="text-sm font-bold text-gray-900 dark:text-theme-dark-text">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4 text-xs dark:text-theme-dark-subtext">
          {descriptiion}
        </p>
        <div className="mt-auto text-[10px] text-gray-500 dark:text-theme-dark-subtext">
          {names}
        </div>
      </button>
    </div>
  )
}



export const MinimumBar = ({title, value, Slider}: {title: string, value: number, Slider: React.ReactNode}) => {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-gray-700 dark:text-theme-dark-text mb-2">
        <span>{title}</span>
        <span className="font-medium text-[10px]">{value}</span>
      </div>
      {Slider}
    </div>
  )
}

// SearchInput Component - Reusable for both creator and topic inputs
export const SearchInput = ({ 
  label, 
  value, 
  onChange, 
  placeholders, 
  error,
  examples,
  onExampleClick,
  helpText
}: { 
  label: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholders: string[],
  error?: string,
  examples?: string[],
  onExampleClick?: (example: string) => void,
  helpText?: string
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-theme-dark-text mb-2">
        {label}
      </label>
      <PlaceholdersAndVanishInput
        value={value}
        setValue={(val: string) => {}}
        onChange={onChange}
        placeholders={placeholders}
      />
      {error && (
        <p className="mt-1 text-[10px] text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {helpText && (
        <p className="text-[10px] text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {examples && onExampleClick && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-[10px] text-gray-500 flex mt-1">Try:</span>
          {examples.map(example => (
            <button
              key={example}
              onClick={() => onExampleClick(example)}
              className="text-[10px] px-1 py-1 hover:bg-[var(--color-card-bg)] dark:hover:bg-theme-dark-card cursor-pointer rounded transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// PresetButtons Component
export const PresetButtons = ({ 
  presets, 
  onPresetClick 
}: { 
  presets: Array<{id: string, label: string}>,
  onPresetClick: (id: string) => void
}) => {
  return (
    <div className="flex gap-2">
      {presets.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onPresetClick(id)}
          className={cn("px-2 text-[8px] font-sans py-1 rounded-sm flex items-center",
            "transition-all",
            "hover:text-orange bg-[var(--color-card-bg)] dark:bg-theme-dark-card",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// FilterCheckboxes Component
export const FilterCheckboxes = ({ 
  mediaOnly, 
  onMediaOnlyChange, 
  excludeRetweets, 
  onExcludeRetweetsChange 
}: { 
  mediaOnly: boolean,
  onMediaOnlyChange: (checked: boolean) => void,
  excludeRetweets: boolean,
  onExcludeRetweetsChange: (checked: boolean) => void
}) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
      <label className="flex transition items-center gap-2">
        <input
          type="checkbox"
          checked={mediaOnly}
          onChange={(e) => onMediaOnlyChange(e.target.checked)}
          className={cn("w-4 h-4 rounded",
            "accent-[var(--color-theme-fg)] dark:accent-[var(--color-theme-dark-subtext)]"
          )}
        />
        <span className="text-[10px] text-gray-700 dark:text-theme-dark-subtext">Media only (images/videos)</span>
      </label>
      <label className="flex items-center transition gap-2">
        <input
          type="checkbox"
          checked={excludeRetweets}
          onChange={(e) => onExcludeRetweetsChange(e.target.checked)}
          className={cn("w-4 h-4 rounded",
            "accent-theme-dark dark:accent-theme-bg"
          )}
        />
        <span className="text-[10px] text-gray-700 dark:text-theme-dark-subtext">Exclude retweets</span>
      </label>
    </div>
  )
}

// QueryPreview Component
export const QueryPreview = ({ query }: { query: string }) => {
  return (
    <div className="bg-[var(--color-card-bg)] dark:bg-theme-dark-card rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-[10px] text-gray-700 mb-2 flex items-center dark:text-theme-dark-subtext">
        <Search className="w-4 h-4 mr-2 stroke-[var(--color-orange)]" />
        Your X Search Query
      </h4>
      <code className="text-[10px] text-gray-800 dark:text-theme-dark-subtext block bg-[var(--color-theme-bg)] dark:bg-theme-dark p-2 rounded break-all">
        {query}
      </code>
    </div>
  )
}

// GeneratedUrl Component
export const GeneratedUrl = ({ 
  url, 
  onOpen 
}: { 
  url: string,
  onOpen: () => void
}) => {
  return (
    <div className="rounded-lg">
      <h3 className="font-semibold text-[10px] dark:text-theme-dark-text text-h1 mb-4 inline-flex items-center">
        Search URL Generated
      </h3>

      <div className="bg-[var(--color-card-bg)] dark:bg-theme-dark-card p-3 rounded-lg border mb-4 overflow-x-auto">
        <code className="text-[10px] text-gray-700 break-all dark:text-theme-dark-subtext">
          {url}
        </code>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={onOpen}
          className={cn("flex-1 bg-theme-fg dark:bg-theme-dark-card [box-shadow:3px_3px_40px_5px_#c6c6c635_inset] hover:shadow-none text-white font-medium",
            "py-3 px-4 rounded-lg",
            "flex items-center justify-center gap-2",
            "hover:bg-gray-950",
            "transition-colors duration-300 cursor-pointer text-xs")}
        >
          <ExternalLink className="size-3" />
          Open in X
        </button>
      </div>

      <div className="mt-4 p-3 rounded-lg">
        <p className="text-[10px] flex items-center gap-1 dark:text-theme-dark-subtext">
          <span>Not enough hits? Use a preset like "Low Viral".</span>
        </p>
      </div>
    </div>
  )
}

// HistoryItem Component
export const HistoryItem = ({ 
  item, 
  formatted, 
  onLoad, 
  onOpen, 
  onDelete 
}: { 
  item: any,
  formatted: any,
  onLoad: () => void,
  onOpen: () => void,
  onDelete: () => void
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[var(--color-card-bg)] dark:bg-theme-dark-card rounded-lg text-[10px]">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-gray-900 dark:text-theme-dark-text truncate">
            {formatted.title}
          </p>
        </div>
        <p className="text-[10px] text-gray-500">
          {formatted.subtitle} • {formatted.date}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className="text-gray-600 text-[10px] hover:text-gray-700 cursor-pointer hover:underline flex items-center gap-1 px-2 py-1"
        >
          Load
        </button>
        <button
          onClick={onOpen}
          className="text-gray-600 text-[10px] hover:text-gray-700 cursor-pointer hover:underline flex items-center gap-1 px-2 py-1"
        >
          Open
        </button>
        <button
          onClick={onDelete}
          className="text-gray-600 hover:text-gray-700 text-[10px] cursor-pointer hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  )
}