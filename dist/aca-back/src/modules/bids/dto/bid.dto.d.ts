export declare enum LicitacaoStatus {
    draft = "draft",
    open = "open",
    closed = "closed",
    cancelled = "cancelled",
    awarded = "awarded"
}
export declare class CreateBidDto {
    title: string;
    orgao?: string;
    modalidade?: string;
    editalUrl?: string;
    sessionAt?: string;
    submissionDeadline?: string;
    status?: LicitacaoStatus;
    saleValue?: string;
    notes?: string;
}
export declare class UpdateBidDto {
    title?: string;
    orgao?: string;
    modalidade?: string;
    editalUrl?: string;
    sessionAt?: string;
    submissionDeadline?: string;
    status?: LicitacaoStatus;
    saleValue?: string;
    notes?: string;
}
export declare class BidResponseDto {
    id: string;
    title: string;
    orgao?: string;
    modalidade?: string;
    editalUrl?: string;
    sessionAt?: string;
    submissionDeadline?: string;
    status: LicitacaoStatus;
    saleValue?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
