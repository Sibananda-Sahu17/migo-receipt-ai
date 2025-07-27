import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ReceiptData, LineItem, TaxDetail } from '@/api/receipt';
import { Calendar, Clock, MapPin, Receipt, DollarSign, Tag, Building2, FileText } from 'lucide-react';

interface ReceiptDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  onSplitWithFriends?: () => void;
}

export const ReceiptDetailsModal: React.FC<ReceiptDetailsModalProps> = ({
  isOpen,
  onClose,
  receiptData,
  onSplitWithFriends
}) => {
  if (!receiptData) return null;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Receipt Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Merchant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {receiptData.merchant_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {receiptData.merchant_address}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(receiptData.transaction_date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {receiptData.transaction_time}
              </div>
              {receiptData.gst_no && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  GST: {receiptData.gst_no}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipt Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Receipt Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Bill No:</span> {receiptData.bill_no}
                </div>
                <div>
                  <span className="font-medium">Order Ref:</span> {receiptData.order_ref}
                </div>
                <div>
                  <span className="font-medium">Receipt ID:</span> {receiptData.receipt_id}
                </div>
                <div>
                  <span className="font-medium">Language:</span> {receiptData.language.toUpperCase()}
                </div>
              </div>
              {receiptData.note && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Note:</span> {receiptData.note}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Items ({receiptData.line_items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receiptData.line_items.map((item: LineItem, index: number) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.total_price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Details */}
          {receiptData.tax_details && receiptData.tax_details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tax Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {receiptData.tax_details.map((tax: TaxDetail, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <span className="font-medium">{tax.tax_name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({tax.tax_rate}%)</span>
                      </div>
                      <div className="font-medium">{formatCurrency(tax.tax_amount)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(receiptData.subtotal)}</span>
                </div>
                {receiptData.total_tax > 0 && (
                  <div className="flex justify-between">
                    <span>Total Tax:</span>
                    <span>{formatCurrency(receiptData.total_tax)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(receiptData.grand_total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          {receiptData.metadata && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Confidence Score:</span>
                  <Badge variant="outline" className="ml-2">
                    {(receiptData.metadata.confidence_score * 100).toFixed(1)}%
                  </Badge>
                </div>
                {receiptData.metadata.processing_notes && (
                  <div>
                    <span className="font-medium">Processing Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {receiptData.metadata.processing_notes}
                    </p>
                  </div>
                )}
                {receiptData.metadata.additional_fields && Object.keys(receiptData.metadata.additional_fields).length > 0 && (
                  <div>
                    <span className="font-medium">Additional Information:</span>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      {Object.entries(receiptData.metadata.additional_fields).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key.replace(/_/g, ' ').toUpperCase()}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            {onSplitWithFriends && (
              <Button className="flex-1" onClick={onSplitWithFriends}>
                Split with Friends
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 