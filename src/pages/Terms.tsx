import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          <Card className="bg-white/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      By accessing and using Beauty Boutique's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Permission is granted to temporarily download one copy of the materials on Beauty Boutique's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>modify or copy the materials</li>
                      <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                      <li>attempt to decompile or reverse engineer any software contained on the website</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">3. AI Negotiation Service</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our AI-powered negotiation system is provided as-is and subject to the following terms:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>Negotiated prices are final once accepted by both parties</li>
                      <li>The AI system operates within predetermined price ranges set by product suppliers</li>
                      <li>We reserve the right to override AI decisions in cases of system errors or abuse</li>
                      <li>All negotiations are recorded for quality assurance and dispute resolution</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Account Registration</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To access certain features of our service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and all activities that occur under your account.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">5. Purchase Terms</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All purchases made through Beauty Boutique are subject to the following terms:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>All prices are in USD and include applicable taxes</li>
                      <li>Payment is required at the time of purchase</li>
                      <li>We accept major credit cards and digital payment methods</li>
                      <li>Orders are subject to product availability</li>
                      <li>We reserve the right to cancel orders for any reason</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">6. Return and Refund Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We offer a 30-day return policy for unopened beauty products in their original packaging. Opened products may be returned within 14 days for hygiene and safety reasons. Refunds will be processed within 5-7 business days after we receive the returned items. Shipping costs are non-refundable unless the return is due to our error.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">7. Privacy Policy</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      The materials on Beauty Boutique's website are provided on an 'as is' basis. Beauty Boutique makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">9. Limitations</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      In no event shall Beauty Boutique or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Beauty Boutique's website, even if Beauty Boutique or an authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">10. Revisions and Errata</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      The materials appearing on Beauty Boutique's website could include technical, typographical, or photographic errors. Beauty Boutique does not warrant that any of the materials on its website are accurate, complete, or current. Beauty Boutique may make changes to the materials contained on its website at any time without notice.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                  </section>

                  <Separator />

                  <section>
                    <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm">
                        <strong>Beauty Boutique Legal Team</strong><br />
                        Email: legal@beautyboutique.com<br />
                        Phone: +1 (555) 123-4567<br />
                        Address: 123 Beauty Lane, New York, NY 10001
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

export default Terms;