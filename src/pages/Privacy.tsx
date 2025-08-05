import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Eye, Lock, Users } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          {/* Privacy Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/50 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="p-6">
                <Eye className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We're clear about what data we collect and why
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="p-6">
                <Lock className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with industry-standard encryption
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-white/20 text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Control</h3>
                <p className="text-sm text-muted-foreground">
                  You have full control over your personal information
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We collect information you provide directly to us, information we obtain automatically when you use our services, and information from third parties.
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-3">Information You Provide:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                      <li>Account registration information (name, email, password)</li>
                      <li>Profile information and preferences</li>
                      <li>Purchase and transaction information</li>
                      <li>Communication data (chat messages, customer service inquiries)</li>
                      <li>Reviews, ratings, and user-generated content</li>
                    </ul>

                    <h3 className="text-lg font-semibold mb-3">Information Collected Automatically:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage data (pages visited, time spent, click patterns)</li>
                      <li>Location information (with your consent)</li>
                      <li>AI interaction data (negotiation preferences, chat history)</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use the information we collect for various purposes, including:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Providing and maintaining our services</li>
                      <li>Processing transactions and managing your account</li>
                      <li>Personalizing your experience and AI negotiations</li>
                      <li>Communicating with you about your account and our services</li>
                      <li>Improving our website, products, and services</li>
                      <li>Detecting and preventing fraud or security issues</li>
                      <li>Complying with legal obligations</li>
                      <li>Marketing and promotional communications (with your consent)</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">3. AI and Machine Learning</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our AI-powered negotiation system processes your data to provide personalized pricing and recommendations:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Purchase history and browsing behavior inform pricing algorithms</li>
                      <li>Communication patterns help improve chatbot responses</li>
                      <li>Preference data enables product recommendations</li>
                      <li>All AI processing is automated and designed to protect your privacy</li>
                      <li>You can opt out of AI-powered features at any time</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Service providers who assist in operating our website and services</li>
                      <li>Payment processors for transaction handling</li>
                      <li>Shipping companies for order fulfillment</li>
                      <li>Legal compliance or to protect our rights and users' safety</li>
                      <li>Business transfers (mergers, acquisitions) with your consent</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We implement appropriate security measures to protect your personal information:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>SSL encryption for data transmission</li>
                      <li>Secure servers and databases with access controls</li>
                      <li>Regular security audits and updates</li>
                      <li>Employee training on data protection</li>
                      <li>Incident response procedures for data breaches</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You have several rights regarding your personal information:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li><strong>Access:</strong> Request a copy of your personal data</li>
                      <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Portability:</strong> Receive your data in a portable format</li>
                      <li><strong>Objection:</strong> Object to certain processing activities</li>
                      <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use cookies and similar technologies to enhance your experience:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Essential cookies for website functionality</li>
                      <li>Performance cookies to analyze usage patterns</li>
                      <li>Personalization cookies for customized experiences</li>
                      <li>Marketing cookies for targeted advertising (with consent)</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You can manage cookie preferences through your browser settings or our cookie preference center.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Account information is typically retained for the duration of your account plus 7 years for financial records. You can request earlier deletion of your data at any time.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have the information removed.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">11. Updates to This Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Beauty Boutique Privacy Team</strong><br />
                        Email: privacy@beautyboutique.com<br />
                        Phone: +1 (555) 123-4567<br />
                        Address: 123 Beauty Lane, New York, NY 10001<br />
                        Data Protection Officer: privacy@beautyboutique.com
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Privacy;