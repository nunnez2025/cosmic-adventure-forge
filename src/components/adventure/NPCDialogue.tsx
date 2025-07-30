import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, User, Sparkles, Send } from 'lucide-react';
import { AINPC } from '@/types/adventure';
import { cn } from '@/lib/utils';

interface NPCDialogueProps {
  npc: AINPC;
  onComplete: () => void;
  onBack: () => void;
}

interface DialogueMessage {
  id: string;
  speaker: 'npc' | 'player';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

export const NPCDialogue: React.FC<NPCDialogueProps> = ({
  npc,
  onComplete,
  onBack
}) => {
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [isNpcTyping, setIsNpcTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Initialize conversation with NPC greeting
    const greeting = npc.dialogue[0] || `Greetings, Shadow Mage. I am ${npc.name}.`;
    setMessages([{
      id: '1',
      speaker: 'npc',
      text: greeting,
      timestamp: new Date(),
      isTyping: false
    }]);
  }, [npc]);

  const generateAIResponse = async (playerMessage: string): Promise<string> => {
    setIsGenerating(true);
    
    // Mock AI response for now - will be replaced with actual AI calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = [
      `Interesting perspective, Shadow Mage. In my experience as a ${npc.role}, I've learned that...`,
      `That reminds me of an ancient tale from these lands...`,
      `Ah, you speak of matters close to my heart. Let me share what I know...`,
      `*nods thoughtfully* Your words carry wisdom. Perhaps I can offer some insight...`,
      `The shadows whisper many secrets to those who listen carefully...`
    ];
    
    setIsGenerating(false);
    return responses[Math.floor(Math.random() * responses.length)] + 
           ` The mystical energies around ${npc.name} shimmer as they speak of ancient knowledge.`;
  };

  const sendMessage = async () => {
    if (!playerInput.trim() || isNpcTyping || isGenerating) return;

    const newPlayerMessage: DialogueMessage = {
      id: Date.now().toString(),
      speaker: 'player',
      text: playerInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newPlayerMessage]);
    setPlayerInput('');
    setIsNpcTyping(true);

    try {
      const aiResponse = await generateAIResponse(newPlayerMessage.text);
      
      // Simulate typing effect
      setTimeout(() => {
        const npcResponse: DialogueMessage = {
          id: (Date.now() + 1).toString(),
          speaker: 'npc',
          text: aiResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, npcResponse]);
        setIsNpcTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsNpcTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getServiceActions = () => {
    if (!npc.services) return [];
    
    return npc.services.map(service => {
      switch (service.type) {
        case 'heal':
          return { label: 'Heal Shadows', icon: '💚', cost: service.cost || 50 };
        case 'shop':
          return { label: 'Browse Wares', icon: '🛍️', cost: 0 };
        case 'train':
          return { label: 'Train Shadows', icon: '⚔️', cost: service.cost || 100 };
        case 'evolve':
          return { label: 'Evolution Ritual', icon: '✨', cost: service.cost || 200 };
        case 'quest':
          return { label: 'Accept Quest', icon: '📜', cost: 0 };
        default:
          return null;
      }
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-shadow p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 border-2 border-blue-500/50 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{npc.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {npc.role}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {npc.aiModel.toUpperCase()} AI
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dialogue Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="space-y-4 h-96 overflow-y-auto mb-4 p-4 bg-background/50 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.speaker === 'player' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3 space-y-1",
                          message.speaker === 'player'
                            ? "bg-primary text-primary-foreground ml-12"
                            : "bg-muted mr-12"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isNpcTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-muted rounded-lg p-3 mr-12">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {npc.name} is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is generating response...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={playerInput}
                    onChange={(e) => setPlayerInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isNpcTyping || isGenerating}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!playerInput.trim() || isNpcTyping || isGenerating}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NPC Info & Services */}
          <div className="space-y-4">
            {/* NPC Details */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-blue-400" />
                  Character Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {npc.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Personality</h4>
                  <p className="text-sm text-muted-foreground">
                    {npc.personality}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {npc.services && npc.services.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getServiceActions().map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-between h-auto p-3 border-green-500/30 hover:bg-green-500/10"
                      onClick={() => console.log(`Using service: ${action.label}`)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                      </div>
                      {action.cost > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {action.cost} tokens
                        </Badge>
                      )}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-4 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      speaker: 'player',
                      text: "Tell me about this place.",
                      timestamp: new Date()
                    }]);
                  }}
                >
                  Ask about the area
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      speaker: 'player',
                      text: "Do you have any quests for me?",
                      timestamp: new Date()
                    }]);
                  }}
                >
                  Ask for quests
                </Button>

                <Button 
                  onClick={onComplete}
                  className="w-full"
                >
                  End Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};